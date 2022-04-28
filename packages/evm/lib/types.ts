import { AddressType, FeeType, TransactionRequest } from '@chainify/types';
import { BlockWithTransactions as EthersBlockWithTransactions } from '@ethersproject/abstract-provider';
import { PopulatedTransaction as EthersPopulatedTransaction } from '@ethersproject/contracts';
import { Block as EthersBlock, TransactionResponse as EthersTransactionResponse } from '@ethersproject/providers';

export interface EvmSwapOptions {
    contractAddress: string;
}

export type FeeOptions = {
    slowMultiplier?: number;
    averageMultiplier?: number;
    fastMultiplier?: number;
};

export type EthereumTransactionRequest = TransactionRequest & {
    from?: AddressType;
    nonce?: number;
    gasLimit?: number;
    gasPrice?: number;
    chainId?: number;
    type?: number;
    maxPriorityFeePerGas?: number;
    maxFeePerGas?: number;
};

export type EthereumFeeData = FeeType & {
    maxFeePerGas?: null | number;
    maxPriorityFeePerGas?: null | number;
    gasPrice?: null | number;
};

export { EthersTransactionResponse, EthersBlock, EthersBlockWithTransactions, EthersPopulatedTransaction };

export enum NftTypes {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
}
