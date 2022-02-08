import { Transaction, ChunkResult } from 'near-api-js/lib/providers/provider';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Action } from 'near-api-js/lib/transaction';
import { AddressType, TransactionRequest } from '@liquality/types';
import { Account, Connection } from 'near-api-js';

export { Action };
export { parseSeedPhrase } from 'near-seed-phrase';
export { transactions, Account, InMemorySigner, providers, KeyPair, keyStores } from 'near-api-js';

export interface NearTxRequest extends TransactionRequest {
    actions: Action[];
}
export interface NearTxResponse extends FinalExecutionOutcome {
    transaction: NearTransaction;
    status: ExecutionStatus;
}

export interface NearChunk extends ChunkResult {
    transactions: NearTransaction[];
}

export interface NearTransaction extends Transaction {
    signer_id: string;
    public_key: string;
    nonce: number;
    receiver_id: string;
    actions: Action[];
    signature: string;
    hash: string;
}

export interface NearWallet {
    seedPhrase: string;
    secretKey: string;
    publicKey: string;
    address?: AddressType;
}

export class NearAccount extends Account {
    constructor(connection: Connection, accountId: string) {
        super(connection, accountId);
    }
    public async signAndSendTransaction({ receiverId, actions }: any): Promise<FinalExecutionOutcome> {
        return super.signAndSendTransaction({ receiverId, actions });
    }
}

interface ExecutionError {
    error_message: string;
    error_type: string;
}

interface ExecutionStatus {
    SuccessValue?: string;
    SuccessReceiptId?: string;
    Failure?: ExecutionError;
}
