import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { Chain, Fee } from '@liquality/client';
import { AddressType, Asset, BigNumber, Block, FeeDetails, Network, Transaction } from '@liquality/types';
import { EthersBlock, EthersBlockWithTransactions, EthersTransactionResponse } from '../types';
import { calculateFee, parseBlockResponse, parseTxResponse } from '../utils';
import { EvmMulticallProvider } from './EvmMulticallProvider';

export class EvmChainProvider extends Chain<StaticJsonRpcProvider> {
    protected multicall: EvmMulticallProvider;

    constructor(network: Network, provider?: StaticJsonRpcProvider, feeProvider?: Fee) {
        super(network, provider, feeProvider);

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
            blockNumber = await this.getBlockHeight();
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

    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]> {
        const balances = await this.multicall.getMultipleBalances(addresses[0], assets);
        return balances.map((b) => new BigNumber(b.toString()));
    }

    public async sendRawTransaction(rawTransaction: string): Promise<string> {
        const tx = await this.provider.sendTransaction(rawTransaction);
        return tx.hash;
    }

    public async getFees(): Promise<FeeDetails> {
        if (this.feeProvider) {
            return this.feeProvider.getFees();
        } else {
            // Return legacy fees, because not all EVM chains support EIP1559
            const baseGasPrice = (await this.provider.getFeeData()).gasPrice?.toNumber();
            return {
                slow: { fee: calculateFee(baseGasPrice, 1) },
                average: { fee: calculateFee(baseGasPrice, 1.5) },
                fast: { fee: calculateFee(baseGasPrice, 2) },
            };
        }
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
