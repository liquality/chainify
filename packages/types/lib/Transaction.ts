import { BigNumberish } from '.';
import { AddressType } from './Address';
import { Asset } from './Asset';

export interface Transaction<TransactionType = any> {
    // Transaction hash
    hash: string;
    // The value of the transaction
    value: BigNumberish;
    // transaction recipient
    to?: string;
    // transaction sender
    from?: string;
    // transaction status
    status?: TxStatus;
    // Hash of the block containing the transaction
    blockHash?: string;
    // The block number containing the trnasaction
    blockNumber?: BigNumberish;
    // The number of confirmations of the transaction
    confirmations?: BigNumberish;
    // Transaction data
    data?: string;
    // The price per unit of fee
    feePrice?: BigNumberish;
    // The total fee paid for the transaction
    fee?: BigNumberish;
    // The raw transaction object
    _raw: TransactionType;
    // The transaction logs/events
    logs?: any;
}

export interface SwapParams {
    asset: Asset;
    // The amount of native value locked in the swap
    value: BigNumberish;
    //Recepient address of the swap
    recipientAddress: AddressType;
    //Refund address of the swap
    refundAddress: AddressType;
    //Secret Hash
    secretHash: string;
    //Expiration of the swap
    expiration: number;
}

export enum TxStatus {
    Pending = 'PENDING',
    Failed = 'FAILED',
    Success = 'SUCCESS',
    Unknown = 'UNKNOWN',
}

export type TransactionRequest = {
    asset?: Asset;
    to?: AddressType;
    data?: string;
    value?: BigNumberish;
};

export interface FeeData {
    fee?: BigNumberish;
    // Estimated time to confirmation
    wait?: BigNumberish;
}
