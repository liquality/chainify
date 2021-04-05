export interface Transaction<T = any> {
    hash: string;
    value: number;
    blockHash?: string;
    blockNumber?: number;
    confirmations?: number;
    feePrice?: number;
    fee?: number;
    _raw: T;
}
