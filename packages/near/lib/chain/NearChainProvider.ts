import { providers } from 'near-api-js';

import { Chain } from '@liquality/client';
import { Block, Transaction, AddressType, Network, Asset, BigNumberish, FeeData, BigNumber } from '@liquality/types';

import { NearAccount, NearChunk, NearTransaction, NearTxResponse } from '../types';
import { parseBlockResponse, parseNearTx, parseTxResponse } from '../utils';

export class NearChainProvider extends Chain<providers.JsonRpcProvider> {
    constructor(network: Network, provider?: any) {
        super(network, provider);

        if (this.network.rpcUrl) {
            this.provider = new providers.JsonRpcProvider({ url: this.network.rpcUrl });
        }
    }

    async getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any, any>> {
        return this._getBlockById(blockHash, includeTx);
    }

    async getBlockByNumber(blockNumber?: BigNumberish, _includeTx?: boolean): Promise<Block<any, any>> {
        if (!blockNumber) {
            const latestBlock = await this.getBlockHeight();
            return this._getBlockById(Number(latestBlock), _includeTx);
        }
        return this._getBlockById(Number(blockNumber), _includeTx);
    }

    async getBlockHeight(): Promise<BigNumberish> {
        const result = await this.provider.block({ finality: 'final' });
        return result.header.height;
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
        const currentHeight = await this.getBlockHeight();
        const [hash, accountId] = txHash.split('_');
        const tx = (await this.provider.txStatus(hash, accountId)) as NearTxResponse;
        const blockHash = (tx.transaction_outcome as any).block_hash;
        const block = await this.getBlockByHash(blockHash);
        await this.getFees();
        return parseTxResponse(tx, block.number, Number(currentHeight));
    }

    async getBalance(addresses: AddressType[], _assets: Asset[]): Promise<BigNumberish[]> {
        const promiseBalances = await Promise.all(
            addresses.map(async (address) => {
                try {
                    const balance = await this.getAccount(address.toString()).getAccountBalance();
                    return new BigNumber(balance.available);
                } catch (err) {
                    if (err.message && err.message.includes('does not exist while viewing')) {
                        return new BigNumber(0);
                    }
                    throw err;
                }
            })
        );

        return [promiseBalances.map((balance) => new BigNumber(balance)).reduce((acc, balance) => acc.plus(balance), new BigNumber(0))];
    }

    async getFees(): Promise<FeeData> {
        const gasPrice = await this.sendRpcRequest('gas_price', [null]);
        return { fee: gasPrice.gas_price };
    }

    sendRawTransaction(rawTransaction: string): Promise<string> {
        return this.sendRpcRequest('broadcast_tx_commit', [rawTransaction]);
    }

    sendRpcRequest(method: string, params: any[]): Promise<any> {
        return this.provider.sendJsonRpc(method, params);
    }

    async _getBlockById(blockId: number | string, includeTx: boolean) {
        const block = await this.provider.block({ blockId });
        const currentHeight = await this.getBlockHeight();

        if (includeTx && block.chunks) {
            const chunks = await Promise.all(block.chunks.map((c: any) => this.provider.chunk(c.chunk_hash)));
            const transactions = chunks.reduce((p: Transaction<NearTransaction>[], chunk: NearChunk) => {
                chunk.transactions.map((v: NearTransaction) => {
                    p.push(parseNearTx(v, Number(currentHeight), block.header.height));
                });

                return p;
            }, [] as Transaction<NearTransaction>[]);

            return parseBlockResponse(block, transactions);
        }

        return parseBlockResponse(block);
    }

    private getAccount(accountId: string): NearAccount {
        return new NearAccount(
            {
                networkId: this.network.networkId.toString(),
                provider: this.provider,
                signer: null,
            },
            accountId
        );
    }
}
