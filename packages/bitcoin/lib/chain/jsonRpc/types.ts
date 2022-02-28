import { BitcoinNetwork, Transaction } from '../../types';

export interface UTXO {
    txid: string;
    vout: number;
    address: string;
    label: string;
    scriptPubKey: string;
    amount: number;
    confirmations: number;
    redeemScript: string;
    witnessScript: string;
    spendable: boolean;
    solvable: boolean;
    desc: string;
    safe: boolean;
}
export interface ReceivedByAddress {
    involvesWatchOnly: boolean;
    address: string;
    account: string;
    amount: number;
    cofirmations: number;
    label: string;
    txids: string[];
}
export interface MinedTransaction extends Transaction {
    blockhash: string;
    confirmations: number;
    blocktime: number;
    number: number;
}
export interface FundRawResponse {
    hex: string;
    fee: number;
    changepos: number;
}
export interface AddressInfo {
    iswatchonly: boolean;
    pubkey: string;
    hdkeypath: string;
}
export declare type AddressGrouping = string[][];
export interface ReceivedByAddress {
    involvesWatchonly: boolean;
    address: string;
    account: string;
    amount: number;
    confirmations: number;
    label: string;
    txids: string[];
}
export interface Block {
    hash: string;
    confirmations: number;
    size: number;
    strippedSize: number;
    weight: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    tx: string[];
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    chainwork: string;
    nTx: number;
    previousblockhash: string;
    nextblockhash?: string;
}

export interface ProviderOptions {
    // RPC URI
    uri: string;
    // Bitcoin network
    network: BitcoinNetwork;
    // Authentication username
    username?: string;
    // Authentication password
    password?: string;
    // Number of block confirmations to target for fee. Defaul: 1
    feeBlockConfirmations?: number;
    // Default fee per byte for transactions. Default: 3
    defaultFeePerByte?: number;
}

export type FeeOptions = {
    slowTargetBlocks?: number;
    averageTargetBlocks?: number;
    fastTargetBlocks?: number;
};
