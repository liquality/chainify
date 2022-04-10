import { HttpClient } from '@liquality/client';
import { TxNotFoundError } from '@liquality/errors';
import { SwapParams, Transaction, TxStatus } from '@liquality/types';
import { validateSecret, validateSecretAndHash } from '@liquality/utils';
import { isTxError } from '@terra-money/terra.js';
import { TerraWalletProvider } from '..';
import { denomToAssetCode } from '../constants';
import { FCD, TerraTxInfo } from '../types';
import { TerraSwapBaseProvider } from './TerraSwapBaseProvider';

interface ScraperResponse {
    txs?: FCD.LcdTransaction[];
    next?: number;
    limit: number;
}
export class TerraSwapProvider extends TerraSwapBaseProvider {
    private _httpClient: HttpClient;

    constructor(helperUrl: string, walletProvider?: TerraWalletProvider) {
        super(walletProvider);
        this._httpClient = new HttpClient({ baseURL: helperUrl });
    }

    public async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction<TerraTxInfo>> {
        this.validateSwapParams(swapParams);

        return await this.findAddressTransaction(
            swapParams.refundAddress.toString(),
            async (tx: Transaction<TerraTxInfo>) => await this.doesTransactionMatchInitiation(swapParams, tx)
        );
    }

    public async findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<TerraTxInfo>> {
        const initTx = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, initTx);

        return await this.findAddressTransaction(initTx.to.toString(), async (tx: Transaction<TerraTxInfo>) => {
            if (tx.secret && tx._raw.method === 'claim') {
                validateSecret(tx.secret);
                validateSecretAndHash(tx.secret, swapParams.secretHash);
                return true;
            }
        });
    }
    public async findRefundSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<TerraTxInfo>> {
        const initTx = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, initTx);

        return await this.findAddressTransaction(initTx.to.toString(), async (tx: Transaction<TerraTxInfo>) => {
            if (tx._raw.method === 'refund') {
                return true;
            }
        });
    }

    private async findAddressTransaction(
        address: string,
        predicate: (tx: Transaction<TerraTxInfo>) => Promise<boolean>,
        limit = 100
    ): Promise<Transaction<TerraTxInfo>> {
        let offset: number = null;
        const currentBlockNumber = await this.walletProvider.getChainProvider().getBlockHeight();
        const baseUrl = `/txs?account=${address}&limit=${limit}`;
        do {
            const url = offset ? baseUrl + `&offset=${offset}` : baseUrl;
            const response = await this._httpClient.nodeGet<null, ScraperResponse>(url);

            if (!response?.txs) {
                throw new TxNotFoundError(`Transactions not found: ${address}`);
            }

            for (const tx of response.txs) {
                const parsedTx = await this.parseScraperTransaction(tx, currentBlockNumber);

                const doesMatch = await predicate(parsedTx);
                if (doesMatch) {
                    return parsedTx;
                }
            }

            offset = response.next || null;
        } while (offset !== null);
    }

    private async parseScraperTransaction(data: FCD.LcdTransaction, currentBlockNumber: number) {
        const result: Transaction<Partial<TerraTxInfo>> = {
            hash: data.txhash,
            _raw: { code: data.code },
            value: 0,
            confirmations: Number(data.height) - currentBlockNumber,
            status: isTxError(data as any) ? TxStatus.Failed : TxStatus.Success,
        };

        const txType = data?.tx?.value?.msg?.[0]?.type;

        switch (txType) {
            // Init
            case 'wasm/MsgInstantiateContract': {
                const initTx = data.tx.value.msg[0].value;
                if (initTx) {
                    const network = await this.getWallet().getConnectedNetwork();
                    // only valid txns
                    if (Number(initTx.code_id) === network.codeId) {
                        const initMsg = initTx.init_msg;

                        if (initMsg) {
                            result._raw.htlc = { ...initMsg, code_id: Number(initTx.code_id) };
                            result._raw.method = 'init';
                        }
                        result.from = initTx.sender;

                        if (initTx.init_coins?.[0]) {
                            const { amount, denom } = initTx.init_coins[0];
                            result.value = Number(amount);
                            result.valueAsset = denomToAssetCode[denom];
                        }

                        if (data.tx.value?.fee?.amount?.[0]) {
                            const { amount, denom } = data.tx.value.fee.amount[0];
                            result.fee = Number(amount);
                            result.feeAssetCode = denomToAssetCode[denom];
                        }
                    }
                }
                break;
            }

            // refund & claim
            case 'wasm/MsgExecuteContract': {
                const tx = data.tx.value.msg[0].value;

                if (tx) {
                    result.from = tx.sender;
                    result.to = tx.contract;

                    if (tx.execute_msg.refund) {
                        result._raw.method = 'refund';
                    } else if (tx.execute_msg.claim) {
                        result._raw.method = 'claim';
                        result.secret = tx.execute_msg.claim.secret;
                    }
                }

                break;
            }
        }

        return result as Transaction<TerraTxInfo>;
    }
}
