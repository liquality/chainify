import { Chain, Fee, HttpClient } from '@chainify/client';
import { NodeError, TxNotFoundError, UnsupportedMethodError } from '@chainify/errors';
import { Logger } from '@chainify/logger';
import { AddressType, Asset, BigNumber, Block, FeeDetails, TokenDetails, Transaction } from '@chainify/types';
import { BlockInfo, LCDClient } from '@terra-money/terra.js';
import { assetCodeToDenom } from '../constants';
import { TerraNetwork, TerraTxInfo } from '../types';
import { parseBlockResponse, parseTxResponse } from '../utils';

const logger = new Logger('TerraChainProvider');

const DEFAULT_ASSETS_FETCH_URL = 'https://assets.terra.money/cw20/tokens.json';

export class TerraChainProvider extends Chain<LCDClient, TerraNetwork> {
    public _httpClient: HttpClient;

    constructor(network: TerraNetwork, provider?: LCDClient, feeProvider?: Fee) {
        super(network, provider, feeProvider);

        if (!provider) {
            this.provider = new LCDClient({ URL: network.rpcUrl, chainID: network.chainId.toString() });
        }

        this._httpClient = new HttpClient({ baseURL: network.helperUrl });
    }

    public async getTokenDetails(asset: string): Promise<TokenDetails> {
        try {
            const {
                data: { mainnet: tokens },
            } = await new HttpClient({ baseURL: this.network.assetsUrl || DEFAULT_ASSETS_FETCH_URL }).nodeGet('/');
            const token = tokens[asset];
            const { symbol } = token;
            return { name: symbol, symbol, decimals: 6 };
        } catch (err) {
            logger.error(err);
            throw new NodeError(`Cannot fetch details for ${asset}`);
        }
    }

    public async getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block<BlockInfo, TerraTxInfo>> {
        const block = await this.provider.tendermint.blockInfo(blockNumber);
        const currentBlockNumber = await this.getBlockHeight();

        if (!includeTx) {
            return parseBlockResponse(block);
        } else {
            const txs = await this.provider.tx.txInfosByHeight(Number(block.block.header.height));
            const transactions = txs.map((tx) => parseTxResponse(tx, currentBlockNumber));
            return { ...parseBlockResponse(block), transactions };
        }
    }

    public async getBlockHeight(): Promise<number> {
        const blockInfo = await this.provider.tendermint.blockInfo();
        return Number(blockInfo.block.header.height);
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<TerraTxInfo>> {
        const transaction = await this.provider.tx.txInfo(txHash);
        const currentBlockNumber = await this.getBlockHeight();

        if (!transaction) {
            throw new TxNotFoundError(`Transaction not found: ${txHash}`);
        }

        return parseTxResponse(transaction, currentBlockNumber);
    }

    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]> {
        const address = addresses[0].toString();
        const promiseBalances = await Promise.all(
            assets.map(async (asset) => {
                try {
                    let balance = 0;

                    if (asset.isNative) {
                        const coins = await this.provider.bank.balance(address);
                        balance = Number(coins[0].get(assetCodeToDenom[asset.code])?.amount) || 0;
                    } else {
                        const token = await this.provider.wasm.contractQuery<{ balance: string }>(asset.contractAddress, {
                            balance: { address },
                        });
                        balance = Number(token.balance);
                    }

                    return new BigNumber(balance);
                } catch (err) {
                    if (err.message && err.message.includes('does not exist while viewing')) {
                        return new BigNumber(0);
                    } else {
                        logger.debug('getBalance', err);
                        return null;
                    }
                }
            })
        );

        return promiseBalances;
    }

    public async getFees(feeAsset?: Asset): Promise<FeeDetails> {
        if (this.feeProvider) {
            return this.feeProvider.getFees(feeAsset);
        } else {
            const prices = await this._httpClient.nodeGet('/txs/gas_prices');
            const denom = assetCodeToDenom[feeAsset?.code || 'LUNA'];
            const fee = Number(prices[denom]);
            return {
                slow: { fee },
                average: { fee },
                fast: { fee },
            };
        }
    }

    public async sendRpcRequest(method: keyof APIRequester, params: any[]): Promise<any> {
        const [endpoint, args] = params;
        return this.provider.apiRequester[method](endpoint, args);
    }

    public getBlockByHash(_blockHash: string, _includeTx?: boolean): Promise<Block<BlockInfo, TerraTxInfo>> {
        throw new UnsupportedMethodError('Method not supported.');
    }

    public async sendRawTransaction(_rawTransaction: string): Promise<string> {
        throw new UnsupportedMethodError('Method not supported.');
    }
}

declare type APIParams = Record<string, string | number | null | undefined>;

declare class APIRequester {
    private axios;
    constructor(baseURL: string);
    getRaw<T>(endpoint: string, params?: URLSearchParams | APIParams): Promise<T>;
    get<T>(endpoint: string, params?: URLSearchParams | APIParams): Promise<T>;
    postRaw<T>(endpoint: string, data?: any): Promise<T>;
    post<T>(endpoint: string, data?: any): Promise<T>;
}
