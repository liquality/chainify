import { StaticJsonRpcProvider, JsonRpcProvider } from '@ethersproject/providers';

import { Chain } from '@liquality/client';
import { Block, Transaction, AddressType, Network, Asset, BigNumberish } from '@liquality/types';

import { parseBlockResponse, parseTxResponse } from '../utils';
import { EvmMulticallProvider } from './EvmMulticallProvider';
import { EthersBlock, EthersTransactionResponse, EthersBlockWithTransactions, EthereumFeeData } from '../types';

export class EvmChainProvider extends Chain<StaticJsonRpcProvider> {
    protected multicall: EvmMulticallProvider;

    constructor(network: Network, provider?: StaticJsonRpcProvider) {
        super(network, provider);

        if (!provider && this.network.rpcUrl) {
            this.provider = new StaticJsonRpcProvider(this.network.rpcUrl, this.network.chainId);
        }

        this.multicall = new EvmMulticallProvider(this.provider, Number(network.chainId));
    }

    public async getBlockByHash(
        blockHash: string,
        includeTx = false
    ): Promise<Block<EthersBlock | EthersBlockWithTransactions, EthersTransactionResponse>> {
        return this._getBlock(blockHash, includeTx);
    }

    public async getBlockByNumber(
        blockNumber?: number,
        includeTx = false
    ): Promise<Block<EthersBlock | EthersBlockWithTransactions, EthersTransactionResponse>> {
        if (!blockNumber) {
            const latestBlock = await this.getBlockHeight();
            return this._getBlock(latestBlock, includeTx);
        }
        return this._getBlock(blockNumber, includeTx);
    }

    public async getBlockHeight(): Promise<number> {
        return this.provider.getBlockNumber();
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<EthersTransactionResponse>> {
        const tx = await this.provider.getTransaction(txHash);
        const result = parseTxResponse(tx);

        if (result.confirmations > 0) {
            const receipt = await this.provider.getTransactionReceipt(txHash);
            return parseTxResponse(tx, receipt);
        }

        return result;
    }

    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumberish[]> {
        const balances = await this.multicall.getMultipleBalances(addresses[0], assets);
        return balances.map((b) => b.toString());
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
