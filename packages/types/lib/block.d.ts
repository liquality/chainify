export interface Block<TransactionType = any> {
    number: number;
    hash: string;
    timestamp: number;
    size: number;
    difficulty: number;
    parentHash: string;
    nonce: number;
    transactions?: TransactionType[];
}
