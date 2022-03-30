import { Address, AddressType } from './Address';
import { Asset } from './Asset';
import { FeeType } from './Fees';
import { Transaction, TransactionRequest } from './Transaction';

export interface WalletOptions {
    mnemonic: string;
    derivationPath: string;
    index: string;
    data?: Record<string, any>;
}

export interface WalletProvider {
    getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]>;

    getUsedAddresses(numAddressPerCall?: number): Promise<Address[]>;

    sendTransaction(options: TransactionRequest): Promise<Transaction>;

    sendSweepTransaction(address: AddressType, asset: Asset, fee?: FeeType): Promise<Transaction>;

    updateTransactionFee(tx: string | Transaction, newFee: FeeType): Promise<Transaction>;

    sendBatchTransaction(transactions: TransactionRequest[]): Promise<Transaction[]>;

    getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address>;

    signMessage(message: string, from: string): Promise<string>;

    getConnectedNetwork(): Promise<any>;

    isWalletAvailable(): Promise<boolean>;

    canUpdateFee?: boolean | (() => boolean);

    exportPrivateKey?: () => Promise<string>;
}
