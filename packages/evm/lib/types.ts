import { PopulatedTransaction as EthersPopulatedTransaction } from '@ethersproject/contracts';
import { BlockWithTransactions as EthersBlockWithTransactions } from '@ethersproject/abstract-provider';
import { TransactionResponse as EthersTransactionResponse, Block as EthersBlock } from '@ethersproject/providers';

import { AddressType, BigNumberish, FeeData, TransactionRequest } from '@liquality/types';

export type EthereumTransactionRequest = TransactionRequest & {
    from?: AddressType;
    nonce?: BigNumberish;
    gasLimit?: BigNumberish;
    gasPrice?: BigNumberish;
    chainId?: number;
    type?: number;
    maxPriorityFeePerGas?: BigNumberish;
    maxFeePerGas?: BigNumberish;
};

export type EthereumFeeData = FeeData & {
    maxFeePerGas?: null | BigNumberish;
    maxPriorityFeePerGas?: null | BigNumberish;
    gasPrice?: null | BigNumberish;
};

export { EthersTransactionResponse, EthersBlock, EthersBlockWithTransactions, EthersPopulatedTransaction };

export enum NftTypes {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
}
