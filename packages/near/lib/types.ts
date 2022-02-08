import BN from 'bn.js';
import { Account, Connection } from 'near-api-js';
import { Action } from 'near-api-js/lib/transaction';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Transaction, ChunkResult } from 'near-api-js/lib/providers/provider';
import { Network, AddressType, BigNumberish, TransactionRequest } from '@liquality/types';

export { Action };
export { BN };
export { parseSeedPhrase } from 'near-seed-phrase';
export { transactions, Account, InMemorySigner, providers, KeyPair, keyStores } from 'near-api-js';

export interface NearNetwork extends Network {
    helperUrl: string;
}
export interface NearScraperData {
    block_hash: string;
    block_timestamp: string;
    hash: string;
    action_index: number;
    signer_id: string;
    receiver_id: string;
    action_kind: string;
    args: Args;
}
export interface NearTxLog {
    hash: string;
    sender: string;
    receiver: string;
    blockHash: string;
    code?: string;
    value?: BigNumberish;
    htlc?: {
        method: string;
        secretHash?: string;
        expiration?: number;
        recipient?: string;
        secret?: string;
    };
}
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

interface Args {
    gas: number;
    deposit: string;
    code_sha256: string;
    args_json: Record<string, unknown>;
    args_base64: string;
    method_name: string;
}
