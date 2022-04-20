import { Block, Transaction, TxStatus } from '@liquality/types';
import { Math } from '@liquality/utils';
import { BlockResponse, ParsedInstruction, ParsedTransactionWithMeta, RpcResponseAndContext, SignatureStatus } from '@solana/web3.js';

export function parseBlockResponse(data: BlockResponse): Block {
    return {
        hash: data.blockhash,
        timestamp: data.blockTime,
        number: data.parentSlot + 1,
        parentHash: data.previousBlockhash,
        _raw: data,
    };
}

export function parseTransactionResponse(
    data: ParsedTransactionWithMeta,
    signatures?: RpcResponseAndContext<SignatureStatus>
): Transaction {
    const txInstructions = data.transaction.message.instructions as ParsedInstruction[];
    const result: Transaction<ParsedTransactionWithMeta> = {
        hash: data.transaction.signatures[0],
        value: 0,
        _raw: data,
        fee: data.meta?.fee,
    };

    if (signatures) {
        // If the confirmations are null then the tx is rooted i.e. finalized by a supermajority of the cluster
        result.confirmations = signatures.value.confirmations === null ? 10 : signatures.value.confirmations;
        // Error if transaction failed, null if transaction succeeded.
        result.status = signatures.value.err === null ? TxStatus.Success : TxStatus.Failed;
    }

    for (const instruction of txInstructions) {
        switch (instruction.program) {
            case 'system': {
                // SOL transfers
                if (instruction.parsed?.type === 'transfer') {
                    const parsedInfo = instruction.parsed.info;
                    if (parsedInfo) {
                        result.value = Math.add(parsedInfo.lamports || 0, result.value).toNumber();
                        result.from = parsedInfo.source;
                        result.to = parsedInfo.destination;
                        result.fee;
                    }
                }
                break;
            }

            // SPL transfers
            case 'spl-token': {
                break;
            }
        }
    }

    return result;
}
