import { BigNumber, BigNumberish, Block, EIP1559Fee, FeeType, SwapParams, Transaction, TxStatus } from '@chainify/types';
import { ensure0x } from '@chainify/utils';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';
import { TransactionReceipt, TransactionRequest } from '@ethersproject/providers';
import { sha256 } from '@ethersproject/solidity';
import { TransactionTypes } from '@ethersproject/transactions';
import { ILiqualityHTLC } from './typechain';
import {
    EthereumTransactionRequest,
    EthersBlock,
    EthersBlockWithTransactions,
    EthersPopulatedTransaction,
    EthersTransactionResponse,
} from './types';

export function toEthereumTxRequest(tx: EthersPopulatedTransaction, fee: FeeType): EthereumTransactionRequest {
    return {
        ...tx,
        value: tx.value && new BigNumber(tx.value.toString()),
        gasLimit: tx.gasLimit?.toNumber(),
        gasPrice: tx.gasPrice?.toNumber(),
        maxFeePerGas: tx.maxFeePerGas?.toNumber(),
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toNumber(),
        fee,
    };
}

export function parseSwapParams(tx: SwapParams): ILiqualityHTLC.HTLCDataStruct {
    return {
        amount: tx.value.toString(10),
        expiration: tx.expiration,
        secretHash: ensure0x(tx.secretHash),
        tokenAddress: ensure0x(tx.asset.isNative ? AddressZero : tx.asset.contractAddress),
        refundAddress: ensure0x(tx.refundAddress.toString()),
        recipientAddress: ensure0x(tx.recipientAddress.toString()),
    };
}

export function parseTxRequest(request: EthereumTransactionRequest | TransactionRequest): TransactionRequest {
    const result: TransactionRequest = {
        chainId: request.chainId,

        to: ensure0x(request.to?.toString()),
        from: ensure0x(request.from?.toString()),
        data: ensure0x(request.data?.toString()),

        nonce: toEthersBigNumber(request.nonce),
        gasLimit: toEthersBigNumber(request.gasLimit),
        value: toEthersBigNumber(request.value),
    };

    if (request.maxFeePerGas && request.maxPriorityFeePerGas) {
        result.type = TransactionTypes.eip1559;
        result.gasPrice = null;
        result.maxFeePerGas = toEthersBigNumber(request.maxFeePerGas);
        result.maxPriorityFeePerGas = toEthersBigNumber(request.maxPriorityFeePerGas);
    } else {
        result.type = TransactionTypes.legacy;
        result.gasPrice = toEthersBigNumber(request.gasPrice);
    }

    return result;
}

export function parseTxResponse(response: EthersTransactionResponse, receipt?: TransactionReceipt): Transaction<EthersTransactionResponse> {
    const result: Transaction<EthersTransactionResponse | > = {
        to: response.to,
        from: response.from,
        hash: response.hash,
        data: response.data,
        value: parseInt(response.value?.toString()),
        blockHash: response.blockHash,
        blockNumber: response.blockNumber,
        confirmations: Math.max(response.confirmations, 0),
        feePrice: parseInt(response.gasPrice?.toString()),
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

export function extractFeeData(fee: FeeType) {
    if (typeof fee === 'number') {
        return { gasPrice: fromGwei(fee).toNumber() };
    } else {
        const eip1559Fee = {} as EIP1559Fee;
        if (fee.maxFeePerGas) {
            eip1559Fee.maxFeePerGas = fromGwei(fee.maxFeePerGas).toNumber();
        }

        if (fee.maxPriorityFeePerGas) {
            eip1559Fee.maxPriorityFeePerGas = fromGwei(fee.maxPriorityFeePerGas).toNumber();
        }

        return { ...fee, ...eip1559Fee };
    }
}

export function toGwei(wei: BigNumber | number | string): BigNumber {
    return new BigNumber(wei).div(1e9);
}

export function fromGwei(gwei: BigNumber | number | string): BigNumber {
    return new BigNumber(gwei).multipliedBy(1e9).dp(0, BigNumber.ROUND_CEIL);
}

export function calculateFee(base: BigNumber | number | string, multiplier: number) {
    return new BigNumber(base).times(multiplier).toNumber();
}

function toEthersBigNumber(a: BigNumberish): EthersBigNumber {
    if (a?.toString()) {
        return EthersBigNumber.from(a.toString(10));
    }
}

export function calculateGasMargin(value: BigNumberish, margin = 1000) {
    const offset = new BigNumber(value.toString()).multipliedBy(margin).div('10000');
    return toEthersBigNumber(offset.plus(value.toString()).toFixed(0));
}
