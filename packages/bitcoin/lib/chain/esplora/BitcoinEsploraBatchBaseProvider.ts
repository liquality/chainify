import { HttpClient } from '@chainify/client';
import { AddressType, BigNumber } from '@chainify/types';
import { flatten, uniq } from 'lodash';
import { UTXO } from '../../types';
import { BitcoinEsploraBaseProvider } from './BitcoinEsploraBaseProvider';
import * as EsploraTypes from './types';

export class BitcoinEsploraBatchBaseProvider extends BitcoinEsploraBaseProvider {
    private _batchHttpClient: HttpClient;

    constructor(options: EsploraTypes.EsploraBatchApiProviderOptions) {
        super(options);
        this._batchHttpClient = new HttpClient({ baseURL: options.batchUrl });
    }

    async getUnspentTransactions(_addresses: AddressType[]): Promise<UTXO[]> {
        const addresses = _addresses.map((a) => a.toString());
        const data: EsploraTypes.BatchUTXOs = await this._batchHttpClient.nodePost('/addresses/utxo', {
            addresses: uniq(addresses),
        });

        const utxos = data.map(({ address, utxo }) => {
            return utxo.map((obj) => ({
                ...obj,
                address,
                satoshis: obj.value,
                amount: new BigNumber(obj.value).dividedBy(1e8).toNumber(),
                blockHeight: obj.status.block_height,
            }));
        });

        return flatten(utxos);
    }

    async getAddressTransactionCounts(_addresses: AddressType[]) {
        const addresses = _addresses.map((a) => a.toString());
        const data: EsploraTypes.Address[] = await this._batchHttpClient.nodePost('/addresses', {
            addresses: uniq(addresses),
        });

        return data.reduce((acc: { [index: string]: number }, obj) => {
            acc[obj.address] = obj.chain_stats.tx_count + obj.mempool_stats.tx_count;
            return acc;
        }, {});
    }
}
