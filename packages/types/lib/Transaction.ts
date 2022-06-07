import { BigNumber, FeeType } from '.';
import { AddressType } from './Address';
import { Asset } from './Asset';

export interface Transaction<TransactionType = any> {
    // Transaction hash
    hash: string;
    // The value of the transaction
    value: number;
    // The asset send in the transaction
    valueAsset?: string;
    // transaction recipient
    to?: AddressType;
    // transaction sender
    from?: AddressType;
    // transaction status
    status?: TxStatus;
    // Hash of the block containing the transaction
    blockHash?: string;
    // The block number containing the trnasaction
    blockNumber?: number;
    // The number of confirmations of the transaction
    confirmations?: number;
    // Transaction data
    data?: string;
    // Secret of a HTLC
    secret?: string;
    // The price per unit of fee
    feePrice?: number;
    // The total fee paid for the transaction
    fee?: number;
    // The asset code used to pay the tx fee
    feeAssetCode?: string;
    // The raw transaction object
    _raw: TransactionType;
    // The transaction logs/events
    logs?: any;
}

export enum TxStatus {
    Pending = 'PENDING',
    Failed = 'FAILED',
    Success = 'SUCCESS',
    Unknown = 'UNKNOWN',
}

export type TransactionRequest = {
    asset?: Asset;
    feeAsset?: Asset;
    to?: AddressType;
    data?: string;
    value?: BigNumber;
    fee?: FeeType;
    gasLimit?: number;
};
