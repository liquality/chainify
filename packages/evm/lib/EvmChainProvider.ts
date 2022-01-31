import { Chain } from '@liquality/client';
import { Block, Transaction, AddressType, BigNumber, Network } from '@liquality/types';
import { StaticJsonRpcProvider, JsonRpcProvider, BaseProvider } from '@ethersproject/providers';
import { parseBlockResponse, parseTxResponse } from './utils';
import { EthereumBlock, EthereumTransaction, EthereumBlockWithTransactions, EthereumFeeData } from './types';

export class EvmChainProvider extends Chain<BaseProvider> {
    constructor(network: Network, provider?: BaseProvider) {
        super(network, provider);

        if (this.network.rpcUrl) {
            this.provider = new StaticJsonRpcProvider(this.network.rpcUrl, this.network.chainId);
        }
    }

    public async getBlockByHash(
        blockHash: string,
        includeTx = false
    ): Promise<Block<EthereumBlock | EthereumBlockWithTransactions, Transaction<EthereumTransaction>>> {
        return this._getBlock(blockHash, includeTx);
    }

    public async getBlockByNumber(
        blockNumber: number,
        includeTx = false
    ): Promise<Block<EthereumBlock | EthereumBlockWithTransactions, Transaction<EthereumTransaction>>> {
        return this._getBlock(blockNumber, includeTx);
    }

    public async getBlockHeight(): Promise<number> {
        return this.provider.getBlockNumber();
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<EthereumTransaction>> {
        const tx = await this.provider.getTransaction(txHash);
        const result = parseTxResponse(tx);

        if (result.confirmations > 0) {
            const receipt = await this.provider.getTransactionReceipt(txHash);
            return parseTxResponse(tx, receipt);
        }

        return result;
    }

    public async getBalance(_addresses: AddressType[], _assets: string[]): Promise<BigNumber[]> {
        throw new Error('Method not implemented.');
    }

    public async sendRawTransaction(rawTransaction: string): Promise<string> {
        const tx = await this.provider.sendTransaction(rawTransaction);
        return tx.hash;
    }

    public async getFees(): Promise<EthereumFeeData> {
        const feeData = await this.provider.getFeeData();
        return {
            maxFeePerGas: feeData.maxFeePerGas.toString(),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toString(),
            gasPrice: feeData.gasPrice.toString(),
        };
    }

    public async sendRpcRequest(method: string, params: any[]): Promise<any> {
        if (this.provider instanceof JsonRpcProvider) {
            return this.provider.send(method, params);
        }
    }

    private async _getBlock(blockTag: number | string, includeTx?: boolean) {
        if (includeTx) {
            const blockWithTx = await this.provider.getBlockWithTransactions(blockTag);
            return parseBlockResponse(blockWithTx, blockWithTx.transactions);
        } else {
            const block = await this.provider.getBlock(blockTag);
            return parseBlockResponse(block);
        }
    }
}
