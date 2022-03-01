import { Chain, Wallet } from '@liquality/client';
import { Address, FeeType, Transaction, TransactionRequest } from '@liquality/types';
import { PsbtInputTarget } from '../types';

export interface IBitcoinWallet<T, S = any> extends Wallet<T, S> {
    getChainProvider(): Chain<T>;

    sendTransaction(txRequest: TransactionRequest): Promise<Transaction>;

    updateTransactionFee(tx: string | Transaction, newFee: FeeType): Promise<Transaction>;

    getWalletAddress(address: string): Promise<Address>;

    signPSBT(data: string, inputs: PsbtInputTarget[]): Promise<string>;
}
