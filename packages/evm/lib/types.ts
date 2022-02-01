import { AddressType, BigNumberish, FeeData, TransactionRequest } from '@liquality/types';

import { PopulatedTransaction } from '@ethersproject/contracts';
import { BlockWithTransactions as EthereumBlockWithTransactions } from '@ethersproject/abstract-provider';
import { TransactionResponse as EthereumTransaction, Block as EthereumBlock } from '@ethersproject/providers';

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

export { EthereumTransaction, EthereumBlock, EthereumBlockWithTransactions, PopulatedTransaction };

export enum NftTypes {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
}
