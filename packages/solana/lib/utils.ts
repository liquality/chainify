import { Block, Transaction, TxStatus } from '@liquality/types';
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
    transaction: ParsedTransactionWithMeta,
    signatureStatus?: RpcResponseAndContext<SignatureStatus>
): Transaction {
    const {
        transaction: {
            message: { instructions },
            signatures,
        },
    } = transaction;

    const [hash] = signatures;
    const _instructions = instructions as ParsedInstruction[];

    return {
        hash,
        value: _instructions?.[0]?.parsed?.info?.lamports || Number(_instructions?.[0]?.parsed?.info?.amount) || 0, // "lamports" to extract SOL value from tx / "amount" to extract SLP value from tx
        _raw: transaction,
        ...(signatureStatus && {
            confirmations: signatureStatus.value.confirmations,
            status: signatureStatus.value.err ? TxStatus.Failed : TxStatus.Success,
        }),
    };
}
