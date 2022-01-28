import { Chain, Wallet } from '@liquality/client';
import { AddressType, BigNumberish, Transaction, WalletOptions } from '@liquality/types';
import { BaseProvider } from '@ethersproject/providers';
import { Wallet as EthersWallet } from '@ethersproject/wallet';

import { EthereumTransactionRequest, EthereumTransaction, EthereumFeeData } from './types';

export class EvmWalletProvider extends Wallet<BaseProvider> {
    private _wallet: EthersWallet;
    private _walletOptions: WalletOptions;

    constructor(walletOptions: WalletOptions, chainProvider?: Chain<BaseProvider>) {
        super(chainProvider);
        this._walletOptions = walletOptions;
        this._wallet = EthersWallet.fromMnemonic(walletOptions.mnemonic, walletOptions.derivationPath + walletOptions.index);

        if (chainProvider) {
            this._wallet = this._wallet.connect(chainProvider.getProvider());
        }
    }

    public async getAddress(): Promise<AddressType> {
        return this._wallet.address;
    }

    public async getUnusedAddress(_change: boolean, _numAddressPerCall: number): Promise<AddressType> {
        return this._wallet.address;
    }

    public async getUsedAddresses(numAddresses?: number): Promise<AddressType[]> {
        return this.getAddresses(0, numAddresses, false);
    }

    public async getAddresses(start: number, numAddresses: number, _change: boolean): Promise<AddressType[]> {
        const result: AddressType[] = [];
        for (let i = start; i < start + numAddresses; i++) {
            result.push(EthersWallet.fromMnemonic(this._walletOptions.mnemonic, this._walletOptions.derivationPath + i).address);
        }
        return result;
    }

    public signMessage(message: string, _from: AddressType): Promise<string> {
        return this._wallet.signMessage(message);
    }

    public async sendTransaction(txRequest: EthereumTransactionRequest): Promise<Transaction<EthereumTransaction>> {
        const result = await this._wallet.sendTransaction({
            ...txRequest,
            to: txRequest.to.toString(),
            from: txRequest.from.toString(),
            nonce: txRequest.nonce.toString(),
            value: txRequest.value.toString(),
            gasPrice: txRequest.gasPrice.toString(),
            gasLimit: txRequest.gasLimit.toString(),
            maxFeePerGas: txRequest.maxFeePerGas.toString(),
            maxPriorityFeePerGas: txRequest.maxPriorityFeePerGas.toString(),
        });
        return {
            ...result,
            _raw: result,
            value: result.value.toString(),
            blockNumber: result.blockNumber.toString(),
            confirmations: result.confirmations.toString(),
        };
    }

    public async sendBatchTransaction(txRequests: EthereumTransactionRequest[]): Promise<Transaction<EthereumTransaction>[]> {
        const result: Transaction<EthereumTransaction>[] = [];
        for (const txRequest of txRequests) {
            const tx = await this._wallet.sendTransaction({
                ...txRequest,
                to: txRequest.to.toString(),
                from: txRequest.from.toString(),
                nonce: txRequest.nonce.toString(),
                value: txRequest.value.toString(),
                gasPrice: txRequest.gasPrice.toString(),
                gasLimit: txRequest.gasLimit.toString(),
                maxFeePerGas: txRequest.maxFeePerGas.toString(),
                maxPriorityFeePerGas: txRequest.maxPriorityFeePerGas.toString(),
            });
            result.push({
                ...tx,
                _raw: tx,
                value: tx.value.toString(),
                blockNumber: tx.blockNumber.toString(),
                confirmations: tx.confirmations.toString(),
            });
        }
        return result;
    }

    public sendSweepTransaction(_address: AddressType, _fee?: EthereumFeeData): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }

    public updateTransactionFee(_tx: string | Transaction<any>, _newFee: EthereumFeeData): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }

    public getBalance(_assets?: string[]): Promise<BigNumberish | BigNumberish[]> {
        throw new Error('Method not implemented.');
    }

    public async exportPrivateKey(): Promise<string> {
        return this._wallet.privateKey;
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return true;
    }
}
