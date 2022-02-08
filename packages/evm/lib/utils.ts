import { TransactionTypes } from '@ethersproject/transactions';
import { AddressZero } from '@ethersproject/constants';
import { sha256 } from '@ethersproject/solidity';
import { TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { ensure0x } from '@liquality/utils';
import { Transaction, TxStatus, Block, SwapParams } from '@liquality/types';
import {
    EthersBlock,
    EthersBlockWithTransactions,
    EthereumFeeData,
    EthersTransactionResponse,
    EthereumTransactionRequest,
    EthersPopulatedTransaction,
} from './types';
import { ILiqualityHTLC } from './typechain';

export function toEthereumTxRequest(tx: EthersPopulatedTransaction, fee?: EthereumFeeData): EthereumTransactionRequest {
    return {
        ...tx,
        value: tx.value?.toString(),
        gasLimit: tx.gasLimit?.toString(),
        gasPrice: fee?.gasPrice?.toString(),
        maxFeePerGas: fee?.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: fee?.maxPriorityFeePerGas?.toString(),
    };
}

export function parseSwapParams(tx: SwapParams): ILiqualityHTLC.HTLCDataStruct {
    return {
        amount: tx.value.toString(),
        expiration: tx.expiration,
        secretHash: ensure0x(tx.secretHash),
        tokenAddress: tx.asset.isNative ? AddressZero : tx.asset.contractAddress,
        refundAddress: tx.refundAddress.toString(),
        recipientAddress: tx.recipientAddress.toString(),
    };
}

export function parseTxRequest(request: EthereumTransactionRequest | TransactionRequest): TransactionRequest {
    if (request.maxFeePerGas && request.maxPriorityFeePerGas) {
        request.gasPrice = null;
        request.type = TransactionTypes.eip1559;
    } else {
        request.type = TransactionTypes.legacy;
    }

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

export function parseTxResponse(response: EthersTransactionResponse, receipt?: TransactionReceipt): Transaction<EthersTransactionResponse> {
    const result: Transaction<EthersTransactionResponse> = {
        to: response.to,
        from: response.from,
        hash: response.hash,
        data: response.data,
        value: response.value.toString(),
        blockHash: response.blockHash,
        blockNumber: response.blockNumber,
        confirmations: response.confirmations,
        feePrice: response.gasPrice?.toString(),
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
    block: EthersBlock | EthersBlockWithTransactions,
    transactions?: EthersTransactionResponse[]
): Block<EthersBlock | EthersBlockWithTransactions, EthersTransactionResponse> {
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

export function generateId(htlcData: ILiqualityHTLC.HTLCDataStruct, blockTimestamp: number) {
    return sha256(
        ['address', 'uint256', 'uint256', 'uint256', 'bytes32', 'address'],
        [
            htlcData.refundAddress,
            blockTimestamp,
            htlcData.amount.toString(),
            htlcData.expiration,
            htlcData.secretHash,
            htlcData.recipientAddress,
        ]
    );
}
