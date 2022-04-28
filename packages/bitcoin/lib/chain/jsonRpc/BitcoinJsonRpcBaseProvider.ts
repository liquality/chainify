import { JsonRpcProvider } from '@chainify/client';
import { AddressType, BigNumber, Transaction } from '@chainify/types';
import { AddressTxCounts, UTXO as BitcoinUTXO } from '../../types';
import { decodeRawTransaction, normalizeTransactionObject } from '../../utils';
import { BitcoinBaseChainProvider } from '../BitcoinBaseChainProvider';
import { ProviderOptions, ReceivedByAddress, UTXO } from './types';

export class BitcoinJsonRpcBaseProvider extends BitcoinBaseChainProvider {
    public jsonRpc: JsonRpcProvider;
    protected _options: ProviderOptions;

    constructor(options: ProviderOptions) {
        super();
        this.jsonRpc = new JsonRpcProvider(options.uri, options.username, options.password);
        this._options = {
            feeBlockConfirmations: 1,
            defaultFeePerByte: 3,
            ...options,
        };
    }

    public async formatTransaction(tx: any, currentHeight: number): Promise<Transaction<any>> {
        const hex = await this.getTransactionHex(tx.txid);
        const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0;
        const decodedTx = decodeRawTransaction(hex, this._options.network);
        decodedTx.confirmations = confirmations;
        return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height });
    }

    public async getRawTransactionByHash(transactionHash: string): Promise<string> {
        return await this.jsonRpc.send('getrawtransaction', [transactionHash, 0]);
    }

    public async getTransactionHex(transactionHash: string): Promise<string> {
        return this.jsonRpc.send('getrawtransaction', [transactionHash]);
    }

    public async getFeePerByte(numberOfBlocks?: number): Promise<number> {
        try {
            const { feerate } = await this.jsonRpc.send('estimatesmartfee', [numberOfBlocks]);

            if (feerate && feerate > 0) {
                return Math.ceil((feerate * 1e8) / 1000);
            }

            throw new Error('Invalid estimated fee');
        } catch (e) {
            return this._options.defaultFeePerByte;
        }
    }

    public async getUnspentTransactions(_addresses: AddressType[]): Promise<BitcoinUTXO[]> {
        const addresses = _addresses.map((a) => a.toString());
        const utxos: UTXO[] = await this.jsonRpc.send('listunspent', [0, 9999999, addresses]);
        return utxos.map((utxo) => ({ ...utxo, value: new BigNumber(utxo.amount).times(1e8).toNumber() }));
    }

    public async getAddressTransactionCounts(_addresses: AddressType[]): Promise<AddressTxCounts> {
        const addresses = _addresses.map((a) => a.toString());
        const receivedAddresses: ReceivedByAddress[] = await this.jsonRpc.send('listreceivedbyaddress', [0, false, true]);
        return addresses.reduce((acc: AddressTxCounts, addr) => {
            const receivedAddress = receivedAddresses.find((receivedAddress) => receivedAddress.address === addr);
            const transactionCount = receivedAddress ? receivedAddress.txids.length : 0;
            acc[addr] = transactionCount;
            return acc;
        }, {});
    }

    public async getMinRelayFee(): Promise<number> {
        const { relayfee } = await this.jsonRpc.send('getnetworkinfo', []);
        return (relayfee * 1e8) / 1000;
    }
}
