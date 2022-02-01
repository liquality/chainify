import { TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { PopulatedTransaction } from '@ethersproject/contracts';
import { Transaction, TxStatus, Block } from '@liquality/types';
import { EthereumBlock, EthereumBlockWithTransactions, EthereumFeeData, EthereumTransaction, EthereumTransactionRequest } from './types';

export function toEthereumTxRequest(tx: PopulatedTransaction, fee?: EthereumFeeData): EthereumTransactionRequest {
    return {
        ...tx,
        value: tx.value.toString(),
        gasLimit: tx.gasLimit.toString(),
        gasPrice: fee.gasPrice.toString(),
        maxFeePerGas: fee.maxFeePerGas.toString(),
        maxPriorityFeePerGas: fee.maxPriorityFeePerGas.toString(),
    };
}

export function parseTxRequest(request: EthereumTransactionRequest | TransactionRequest): TransactionRequest {
    const result = {
        to: request.to?.toString(),
        from: request.from?.toString(),
        nonce: request.nonce?.toString(),

        gasLimit: request.gasLimit?.toString(),
        gasPrice: request.gasPrice?.toString(),

        data: request.data?.toString(),
        value: request.value?.toString(),
        chainId: request.chainId,

        maxFeePerGas: request.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: request.maxPriorityFeePerGas?.toString(),
    };

    return result;
}

export function parseTxResponse(response: EthereumTransaction, receipt?: TransactionReceipt): Transaction<EthereumTransaction> {
    const result: Transaction<EthereumTransaction> = {
        hash: response.hash,
        value: response.value.toString(),
        blockHash: response.blockHash,
        blockNumber: response.blockNumber,
        confirmations: response.confirmations,
        feePrice: response.gasPrice.toString(),
        _raw: response,
    };

    if (receipt?.confirmations > 0) {
        result.status = Number(receipt.status) > 0 ? TxStatus.Success : TxStatus.Failed;
        result.logs = receipt.logs;
    } else {
        result.status = TxStatus.Pending;
    }

    return result;
}

export function parseBlockResponse(
    block: EthereumBlock | EthereumBlockWithTransactions,
    transactions?: EthereumTransaction[]
): Block<EthereumBlock | EthereumBlockWithTransactions, Transaction<EthereumTransaction>> {
    return {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
        parentHash: block.parentHash,
        difficulty: block.difficulty,
        nonce: Number(block.nonce),
        transactions: transactions?.map((t) => parseTxResponse(t)),
        _raw: block,
    };
}
