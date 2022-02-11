import { BlockResult } from 'near-api-js/lib/providers/provider';

import { Math, remove0x } from '@liquality/utils';
import { Block, SwapParams, Transaction, TxStatus } from '@liquality/types';

import ProgramBytecode from './swap/bytecode';
import { NearTransaction, NearTxResponse, transactions, NearTxLog, NearScraperData, BN } from './types';

export function parseBlockResponse(block: BlockResult, transactions?: Transaction[]): Block<BlockResult> {
    return {
        number: block.header.height,
        hash: block.header.hash,
        // convert nanoseconds to milliseconds
        timestamp: fromNearTimestamp(block.header.timestamp),
        parentHash: block.header.prev_hash,
        transactions,
        _raw: block,
    };
}

export function parseNearBlockTx(tx: NearTransaction, currentBlock: number, txBlock: number): Transaction<NearTransaction> {
    return {
        hash: `${tx.hash}_${tx.signer_id}`,
        value: 0,
        confirmations: currentBlock && txBlock && Math.sub(currentBlock, txBlock).toNumber(),
        _raw: tx,
        ...parseTxActions(tx),
    };
}

export function parseTxResponse(response: NearTxResponse, blockNumber?: number, latestBlock?: number): Transaction<NearTxLog> {
    const tx = response.transaction;
    const parsedActions = parseTxActions(tx);

    const result: Transaction<NearTxLog> = {
        hash: `${tx.hash}_${tx.signer_id}`,
        to: tx.receiver_id,
        from: tx.signer_id,
        value: parsedActions.value || 0,
        _raw: parsedActions,
    };

    if (blockNumber && latestBlock) {
        result.confirmations = Math.sub(latestBlock, blockNumber).toNumber();
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

export function getHtlcActions(swapParams: SwapParams) {
    return [
        transactions.createAccount(),
        transactions.transfer(new BN(swapParams.value.toFixed(0))),
        transactions.deployContract(new Uint8Array(ProgramBytecode)),
        transactions.functionCall(ABI.init.method, formatSwapParams(swapParams), new BN(ABI.init.gas), new BN(0)),
    ];
}

export function getClaimActions(secret: string) {
    const data = Buffer.from(JSON.stringify({ secret: Buffer.from(remove0x(secret), 'hex').toString('base64') }));
    return [transactions.functionCall(ABI.claim.method, data, new BN(ABI.claim.gas), new BN(0))];
}

export function getRefundActions() {
    const data = Buffer.from(JSON.stringify({}));
    return [transactions.functionCall(ABI.refund.method, data, new BN(ABI.refund.gas), new BN(0))];
}

export function parseScraperTransaction(tx: NearScraperData): NearTxLog {
    const normalizedTx: NearTxLog = {
        hash: `${tx.hash}_${tx.signer_id}`,
        blockHash: tx.block_hash,
        sender: tx.signer_id,
        receiver: tx.receiver_id,
    };

    switch (tx.action_kind) {
        case 'DEPLOY_CONTRACT': {
            const code = toBase64(tx.args.code_sha256);
            normalizedTx.code = code;
            break;
        }

        case 'TRANSFER': {
            const value = tx.args.deposit;
            normalizedTx.value = Number(value);
            break;
        }

        case 'FUNCTION_CALL': {
            const method = tx.args.method_name;
            const args = fromBase64(tx.args.args_base64);

            switch (method) {
                case 'init': {
                    normalizedTx.htlc = {
                        method,
                        secretHash: fromBase64(args.secretHash, 'hex'),
                        expiration: fromNearTimestamp(args.expiration),
                        recipient: args.buyer,
                    };
                    break;
                }

                case 'claim': {
                    normalizedTx.htlc = {
                        method,
                        secret: fromBase64(args.secret, 'hex'),
                    };

                    break;
                }

                case 'refund': {
                    normalizedTx.htlc = { method };
                    break;
                }

                default: {
                    break;
                }
            }
            break;
        }

        default: {
            break;
        }
    }
    return normalizedTx;
}

const ABI = {
    init: { method: 'init', gas: '10000000000000' },
    claim: { method: 'claim', gas: '10000000000000' },
    refund: { method: 'refund', gas: '8000000000000' },
};

function toNearTimestampFormat(ts: number): number {
    // in nanoseconds
    return ts * 1000 * 1000 * 1000;
}

function formatSwapParams(swapParams: SwapParams) {
    return Buffer.from(
        JSON.stringify({
            secretHash: Buffer.from(swapParams.secretHash, 'hex').toString('base64'),
            expiration: `${toNearTimestampFormat(swapParams.expiration)}`,
            buyer: swapParams.recipientAddress.toString(),
        })
    );
}

function parseTxActions(tx: NearTransaction) {
    const result = {
        value: 0,
        sender: tx.signer_id,
        receiver: tx.receiver_id,
        hash: `${tx.hash}_${tx.signer_id}`,
    } as NearTxLog;

    for (const action of tx.actions as any[]) {
        if (action.Transfer) {
            result.value = Math.add(action.Transfer.deposit.toString(), result.value).toNumber();
        }

        if (action.DeployContract) {
            result.code = action.DeployContract.code;
        }

        if (action.FunctionCall) {
            const method = action.FunctionCall.method_name;

            switch (method) {
                case 'init': {
                    const args = fromBase64(action.FunctionCall.args);
                    result.htlc = {
                        method,
                        secretHash: fromBase64(args.secretHash, 'hex') as string,
                        expiration: fromNearTimestamp(args.expiration),
                        recipient: args.buyer,
                    };
                    break;
                }

                case 'claim': {
                    const args = fromBase64(action.FunctionCall.args);
                    result.htlc = {
                        method,
                        secret: fromBase64(args.secret, 'hex') as string,
                    };
                    break;
                }

                case 'refund': {
                    result.htlc = { method };
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }

    return result;
}

function toBase64(str: string, encoding = 'hex' as BufferEncoding): string {
    try {
        return Buffer.from(str, encoding).toString('base64');
    } catch (e) {
        return str;
    }
}

function fromBase64(str: string, encoding?: BufferEncoding): any {
    if (!str) {
        return {};
    }

    try {
        const decoded = Buffer.from(str, 'base64').toString(encoding);
        try {
            return JSON.parse(decoded);
        } catch (e) {
            return decoded;
        }
    } catch (e) {
        return str;
    }
}

function fromNearTimestamp(ts: number): number {
    return Number(Math.div(ts, 1000000000).toFixed(0));
}
