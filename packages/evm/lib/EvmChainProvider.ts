import { Chain } from '@liquality/client';
import { Block, Transaction, AddressType, BigNumber, Network, TxStatus } from '@liquality/types';
import { StaticJsonRpcProvider, JsonRpcProvider, BaseProvider } from '@ethersproject/providers';
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
    ): Promise<Block<EthereumBlock | EthereumBlockWithTransactions, EthereumTransaction>> {
        return this._getBlock(blockHash, includeTx);
    }

    public async getBlockByNumber(
        blockNumber: number,
        includeTx = false
    ): Promise<Block<EthereumBlock | EthereumBlockWithTransactions, EthereumTransaction>> {
        return this._getBlock(blockNumber, includeTx);
    }

    public async getBlockHeight(): Promise<number> {
        return this.provider.getBlockNumber();
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<EthereumTransaction>> {
        const tx = await this.provider.getTransaction(txHash);
        const result: Transaction<EthereumTransaction> = {
            hash: tx.hash,
            value: tx.value.toString(),
            blockHash: tx.blockHash,
            blockNumber: tx.blockNumber,
            confirmations: tx.confirmations,
            feePrice: tx.gasPrice.toString(),
            _raw: tx,
        };
        if (result.confirmations > 0) {
            const receipt = await this.provider.getTransactionReceipt(txHash);
            result.status = Number(receipt?.status) > 0 ? TxStatus.Success : TxStatus.Failed;
        } else {
            result.status = TxStatus.Pending;
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
            const block = await this.provider.getBlock(blockTag);
            return {
                number: block.number,
                hash: block.hash,
                timestamp: block.timestamp,
                parentHash: block.parentHash,
                difficulty: block.difficulty,
                nonce: Number(block.nonce),
                _raw: block,
            };
        } else {
            const blockWithTx = await this.provider.getBlockWithTransactions(blockTag);
            return {
                ...blockWithTx,
                nonce: Number(blockWithTx.nonce),
                _raw: blockWithTx,
            };
        }
    }
}
