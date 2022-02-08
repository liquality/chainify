import { BlockResult } from 'near-api-js/lib/providers/provider';

import { Math } from '@liquality/utils';
import { Block, Transaction, TxStatus } from '@liquality/types';

import { NearTransaction, NearTxResponse, Action } from './types';

export function parseBlockResponse(block: BlockResult, transactions?: Transaction[]): Block<BlockResult> {
    return {
        number: block.header.height,
        hash: block.header.hash,
        timestamp: block.header.timestamp,
        parentHash: block.header.prev_hash,
        transactions,
        _raw: block,
    };
}

export function parseNearTx(tx: NearTransaction, currentBlock: number, txBlock: number): Transaction<NearTransaction> {
    return {
        hash: `${tx.hash}_${tx.signer_id}`,
        value: 0,
        confirmations: currentBlock && txBlock && Math.sub(currentBlock, txBlock).toString(),
        _raw: tx,
        ...parseTxAction(tx.actions),
    };
}

export function parseTxResponse(response: NearTxResponse, blockNumber?: number, latestBlock?: number): Transaction<NearTxResponse> {
    const tx = response.transaction;

    const result: Transaction<NearTxResponse> = {
        hash: `${tx.hash}_${tx.signer_id}`,
        to: tx.receiver_id,
        from: tx.signer_id,
        value: 0,
        nonce: tx.nonce,
        _raw: response,
        ...parseTxAction(tx.actions),
    };

    if (blockNumber && latestBlock) {
        result.confirmations = Math.sub(latestBlock, blockNumber).toString();
    }

    result.status = TxStatus.Unknown;

    if (response.status) {
        if (response.status.Failure) {
            result.status = TxStatus.Failed;
        }

        if (!response.status.SuccessValue || typeof response.status.SuccessValue !== 'string') {
            result.status = TxStatus.Failed;
        }

        if (response.status.SuccessReceiptId || typeof response.status.SuccessValue === 'string') {
            result.status = TxStatus.Success;
        }
    }

    return result;
}

function parseTxAction(actions: Action[]) {
    const result = {
        value: 0,
    } as any;

    for (const action of actions as any[]) {
        if (action.Transfer) {
            result.value = Math.add(action.Transfer.deposit.toString(), result.value).toString();
        }
    }

    return result;
}
