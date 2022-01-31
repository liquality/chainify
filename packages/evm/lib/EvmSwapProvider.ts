import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';

import { Swap } from '@liquality/client';
import { SwapParams, Transaction } from '@liquality/types';
import { toStringDeep } from '@liquality/utils';

import { toEthereumTxRequest } from './utils';
import { EthereumFeeData } from './types';
import { LiqualityHTLC } from './typechain';
import { HTLCDataStruct } from './typechain/LiqualityHTLC';
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
        const tx = await this._contract.populateTransaction.initiate(toStringDeep<SwapParams, HTLCDataStruct>(swapParams));
        const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, swapParams, fee));
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
        const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, swapParams, fee));
        return txResponse;
    }

    public async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: EthereumFeeData): Promise<Transaction<any>> {
        const initTx = await this.walletProvider.getChainProvider().getTransactionByHash(initiationTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, initTx);

        const tx = await this._contract.populateTransaction.refund('0');
        const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, swapParams, fee));
        return txResponse;
    }

    protected doesTransactionMatchInitiation(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
