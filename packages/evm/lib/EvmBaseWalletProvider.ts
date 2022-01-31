import { Chain, Wallet } from '@liquality/client';
import { AddressType, BigNumberish, Transaction } from '@liquality/types';
import { Signer } from '@ethersproject/abstract-signer';

import { parseTxRequest, parseTxResponse } from './utils';
import { EthereumTransactionRequest, EthereumTransaction, EthereumFeeData } from './types';

export abstract class EvmBaseWalletProvider<Provider> extends Wallet<Provider, Signer> {
    protected signer: Signer;

    constructor(chainProvider?: Chain<Provider>) {
        super(chainProvider);
    }

    public getSigner() {
        return this.signer;
    }

    public setSigner(signer: Signer) {
        this.signer = signer;
    }

    public async signMessage(message: string, _from: AddressType): Promise<string> {
        return this.signer.signMessage(message);
    }

    public async sendTransaction(txRequest: EthereumTransactionRequest): Promise<Transaction<EthereumTransaction>> {
        const chainId = Number(this.chainProvider.getNetwork().chainId);
        const result = await this.signer.sendTransaction(parseTxRequest({ chainId, ...txRequest }));
        return parseTxResponse(result);
    }

    public async sendBatchTransaction(txRequests: EthereumTransactionRequest[]): Promise<Transaction<EthereumTransaction>[]> {
        const result: Transaction<EthereumTransaction>[] = [];
        for (const txRequest of txRequests) {
            const tx = await this.sendTransaction(txRequest);
            result.push(tx);
        }
        return result;
    }

    public async sendSweepTransaction(_address: AddressType, _fee?: EthereumFeeData): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }

    public async updateTransactionFee(_tx: string | Transaction<any>, _newFee: EthereumFeeData): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }

    public async getBalance(_assets?: string[]): Promise<BigNumberish | BigNumberish[]> {
        throw new Error('Method not implemented.');
    }
}
