import { Transaction } from './Transaction';

export interface Block<BlockType = any, TransactionType = any> {
    // Block number
    number: number;
    // Block hash
    hash: string;
    // Block timestamp in seconds
    timestamp: number;
    // Hash of the parent block
    parentHash?: string;
    // The difficulty field
    difficulty?: number;
    // Nonce
    nonce?: number;
    // The size of this block in bytes
    size?: number;
    // List of transactions
    transactions?: Transaction<TransactionType>[];
    // The chain specific block data
    _raw: BlockType;
}
