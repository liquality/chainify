import { Chain, Wallet } from '@liquality/client';
import { AddressType, Asset, BigNumberish, Transaction } from '@liquality/types';
import { Signer } from '@ethersproject/abstract-signer';

import { parseTxRequest, parseTxResponse, remove0x } from './utils';
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
        const signedMessage = await this.signer.signMessage(message);
        return remove0x(signedMessage);
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

    public async sendSweepTransaction(address: AddressType, asset: Asset, fee?: EthereumFeeData): Promise<Transaction<any>> {
        const balance = (await this.getBalance([asset]))[0];
        const tx: EthereumTransactionRequest = { to: address, value: balance, ...fee };
        return await this.sendTransaction(tx);
    }

    public async updateTransactionFee(
        tx: string | Transaction<EthereumTransaction>,
        newFee: EthereumFeeData
    ): Promise<Transaction<EthereumTransaction>> {
        const transaction: Transaction<EthereumTransaction> =
            typeof tx === 'string' ? await this.chainProvider.getTransactionByHash(tx) : tx;
        const newTransaction = { ...transaction, ...newFee };
        return this.sendTransaction(newTransaction);
    }

    public async getBalance(assets: Asset[]): Promise<BigNumberish[]> {
        const user = await this.getAddress();
        return await this.chainProvider.getBalance([user], assets);
    }
}
