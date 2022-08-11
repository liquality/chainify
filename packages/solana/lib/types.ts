import { TransactionRequest } from '@chainify/types';
import { Transaction } from '@solana/web3.js';

export interface SolanaTxRequest extends TransactionRequest {
    transaction?: Transaction;
}
