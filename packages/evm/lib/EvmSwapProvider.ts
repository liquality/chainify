import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';

import { Swap } from '@liquality/client';
import { SwapParams, Transaction } from '@liquality/types';

import { EthereumFeeData } from './types';
import { LiqualityHTLC } from './typechain';
import { EvmBaseWalletProvider } from './EvmBaseWalletProvider';

export class EvmSwapProvider extends Swap<BaseProvider, Signer> {
    protected walletProvider: EvmBaseWalletProvider<BaseProvider>;
    private _contract: LiqualityHTLC;

    constructor(swapOptions: any, walletProvider?: EvmBaseWalletProvider<BaseProvider>) {
        super(walletProvider);

        if (walletProvider) {
            this._contract.connect(walletProvider.getSigner());
            this._contract.attach(swapOptions.contractAddress);
        }
    }

    getSwapSecret(_claimTxHash: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async initiateSwap(swapParams: SwapParams, fee: EthereumFeeData): Promise<Transaction<any>> {
        const tx = await this._contract.populateTransaction.initiate({
            amount: swapParams.value.toString(),
            expiration: swapParams.expiration.toString(),
            secretHash: swapParams.secretHash,
            tokenAddress: swapParams.asset.contractAddress,
            refundAddress: swapParams.refundAddress.toString(),
            recipientAddress: swapParams.recipientAddress.toString(),
        });

        const txResponse = await this.walletProvider.sendTransaction({
            ...tx,
            asset: swapParams.asset,
            value: tx.value?.toString(),
            gasLimit: tx.gasLimit?.toString(),
            gasPrice: fee.gasPrice?.toString(),
            maxFeePerGas: fee.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: fee.maxPriorityFeePerGas?.toString(),
        });

        return txResponse;
    }

    public async claimSwap(
        swapParams: SwapParams,
        initiationTxHash: string,
        secret: string,
        fee: EthereumFeeData
    ): Promise<Transaction<any>> {
        const initTx = await this.walletProvider.getChainProvider().getTransactionByHash(initiationTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, initTx);

        const tx = await this._contract.populateTransaction.claim('0', secret);

        const txResponse = await this.walletProvider.sendTransaction({
            ...tx,
            asset: swapParams.asset,
            value: 0,
            gasPrice: fee.gasPrice.toString(),
            gasLimit: tx.gasLimit.toString(),
            maxFeePerGas: fee.maxFeePerGas.toString(),
            maxPriorityFeePerGas: fee.maxPriorityFeePerGas.toString(),
        });

        return txResponse;
    }

    public async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: EthereumFeeData): Promise<Transaction<any>> {
        const initTx = await this.walletProvider.getChainProvider().getTransactionByHash(initiationTxHash);

        await this.verifyInitiateSwapTransaction(swapParams, initTx);

        const tx = await this._contract.populateTransaction.refund('0');

        const txResponse = await this.walletProvider.sendTransaction({
            ...tx,
            asset: swapParams.asset,
            value: 0,
            gasPrice: fee.gasPrice.toString(),
            gasLimit: tx.gasLimit.toString(),
            maxFeePerGas: fee.maxFeePerGas.toString(),
            maxPriorityFeePerGas: fee.maxPriorityFeePerGas.toString(),
        });

        return txResponse;
    }

    protected doesTransactionMatchInitiation(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
