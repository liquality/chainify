import { Asset, BigNumber } from '.';
import { AddressType } from './Address';
import { Block } from './Block';
import { Transaction } from './Transaction';

export interface ChainProvider {
    getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>;

    getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block>;

    getBlockHeight(): Promise<number>;

    getTransactionByHash(txHash: string): Promise<Transaction>;

    getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]>;
}
