import { Chain } from '@liquality/client';
import { TxNotFoundError, UnimplementedMethodError } from '@liquality/errors';
import { AddressType, Asset, BigNumber, Block, FeeDetails, Transaction } from '@liquality/types';
import { BlockInfo, LCDClient, TxInfo } from '@terra-money/terra.js';
import { APIRequester } from '@terra-money/terra.js/dist/client/lcd/APIRequester';
import { assetCodeToDenom } from '../constants';
import { TerraNetwork } from '../types';
import { parseBlockResponse, parseTxResponse } from '../utils';

export class TerraChainProvider extends Chain<LCDClient> {
    constructor(network: TerraNetwork) {
        super(network);
        this.provider = new LCDClient({ URL: network.rpcUrl, chainID: network.chainId.toString() });
    }

    public async getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block<BlockInfo, TxInfo>> {
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

    public async getTransactionByHash(txHash: string): Promise<Transaction<TxInfo>> {
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
                    }
                    throw err;
                }
            })
        );

        return promiseBalances;
    }

    public async getFees(): Promise<FeeDetails> {
        throw new Error('Method not implemented.');
    }

    public async sendRpcRequest(method: keyof APIRequester, params: any[]): Promise<any> {
        const [endpoint, args] = params;
        return this.provider.apiRequester[method](endpoint, args);
    }

    public getBlockByHash(_blockHash: string, _includeTx?: boolean): Promise<Block<BlockInfo, TxInfo>> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    public async sendRawTransaction(_rawTransaction: string): Promise<string> {
        throw new UnimplementedMethodError('Method not supported.');
    }
}
