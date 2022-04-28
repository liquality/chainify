import { AddressType, Transaction } from '@chainify/types';
import { AddressTxCounts, UTXO } from '../types';

export abstract class BitcoinBaseChainProvider {
    public abstract formatTransaction(tx: any, currentHeight: number): Promise<Transaction>;

    public abstract getRawTransactionByHash(transactionHash: string): Promise<string>;

    public abstract getTransactionHex(transactionHash: string): Promise<string>;

    public abstract getFeePerByte(numberOfBlocks?: number): Promise<number>;

    public abstract getUnspentTransactions(addresses: AddressType[]): Promise<UTXO[]>;

    public abstract getAddressTransactionCounts(_addresses: AddressType[]): Promise<AddressTxCounts>;

    public abstract getMinRelayFee(): Promise<number>;
}
