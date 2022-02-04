import { Signer } from '@ethersproject/abstract-signer';

import { remove0x } from '@liquality/utils';
import { Chain, Wallet } from '@liquality/client';
import { AddressType, Asset, BigNumberish, Transaction } from '@liquality/types';

import { parseTxRequest, parseTxResponse } from '../utils';
import { EthereumTransactionRequest, EthersTransactionResponse, EthereumFeeData } from '../types';

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

    public async sendTransaction(txRequest: EthereumTransactionRequest): Promise<Transaction<EthersTransactionResponse>> {
        const chainId = Number(this.chainProvider.getNetwork().chainId);
        const result = await this.signer.sendTransaction(parseTxRequest({ chainId, ...txRequest }));
        return parseTxResponse(result);
    }

    public async sendBatchTransaction(txRequests: EthereumTransactionRequest[]): Promise<Transaction<EthersTransactionResponse>[]> {
        const result: Transaction<EthersTransactionResponse>[] = [];
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
        tx: string | Transaction<EthersTransactionResponse>,
        newFee: EthereumFeeData
    ): Promise<Transaction<EthersTransactionResponse>> {
        const transaction: Transaction<EthersTransactionResponse> =
            typeof tx === 'string' ? await this.chainProvider.getTransactionByHash(tx) : tx;

        const { gasPrice, maxPriorityFeePerGas, maxFeePerGas } = transaction._raw;

        if (maxPriorityFeePerGas && newFee.maxPriorityFeePerGas && maxFeePerGas && newFee.maxFeePerGas) {
            if (maxPriorityFeePerGas.gte(newFee.maxPriorityFeePerGas.toString())) {
                throw new Error('Replace transaction underpriced: provide more maxPriorityFeePerGas');
            }
            if (maxFeePerGas.gte(newFee.maxFeePerGas.toString())) {
                throw new Error('Replace transaction underpriced: provide more maxFeePerGas');
            }
        } else if (gasPrice && newFee.gasPrice) {
            if (gasPrice.gte(newFee.gasPrice.toString())) {
                throw new Error('Replace transaction underpriced: provide more gasPrice');
            }
        } else {
            throw new Error('Replace transaction underpriced');
        }

        const newTransaction = { ...transaction, nonce: transaction._raw.nonce, ...newFee };
        return this.sendTransaction(newTransaction);
    }

    public async getBalance(assets: Asset[]): Promise<BigNumberish[]> {
        const user = await this.getAddress();
        return await this.chainProvider.getBalance([user], assets);
    }
}
