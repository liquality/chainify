import { HttpClient } from '@chainify/client';
import { AddressType } from '@chainify/types';
import { flatten } from 'lodash';
import { UTXO } from '../../types';
import { decodeRawTransaction, normalizeTransactionObject } from '../../utils';
import { BitcoinBaseChainProvider } from '../BitcoinBaseChainProvider';
import * as EsploraTypes from './types';

export class BitcoinEsploraBaseProvider extends BitcoinBaseChainProvider {
    public httpClient: HttpClient;
    protected _options: EsploraTypes.EsploraApiProviderOptions;

    constructor(options: EsploraTypes.EsploraApiProviderOptions) {
        super();
        this.httpClient = new HttpClient({ baseURL: options.url });
        this._options = {
            numberOfBlockConfirmation: 1,
            defaultFeePerByte: 3,
            ...options,
        };
    }

    public async formatTransaction(tx: EsploraTypes.Transaction, currentHeight: number) {
        const hex = await this.getTransactionHex(tx.txid);
        const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0;
        const decodedTx = decodeRawTransaction(hex, this._options.network);
        decodedTx.confirmations = confirmations;
        return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height });
    }

    public async getRawTransactionByHash(transactionHash: string) {
        return this.getTransactionHex(transactionHash);
    }

    public async getTransactionHex(transactionHash: string): Promise<string> {
        return this.httpClient.nodeGet(`/tx/${transactionHash}/hex`);
    }

    public async getFeePerByte(numberOfBlocks = this._options.numberOfBlockConfirmation) {
        try {
            const feeEstimates: EsploraTypes.FeeEstimates = await this.httpClient.nodeGet('/fee-estimates');
            const blockOptions = Object.keys(feeEstimates).map((block) => parseInt(block));
            const closestBlockOption = blockOptions.reduce((prev, curr) => {
                return Math.abs(prev - numberOfBlocks) < Math.abs(curr - numberOfBlocks) ? prev : curr;
            });
            const rate = Math.round(feeEstimates[closestBlockOption]);
            return rate;
        } catch (e) {
            return this._options.defaultFeePerByte;
        }
    }

    public async getUnspentTransactions(_addresses: AddressType[]): Promise<UTXO[]> {
        const addresses = _addresses.map((a) => a.toString());
        const utxoSets = await Promise.all(addresses.map((addr) => this._getUnspentTransactions(addr), this));
        const utxos = flatten(utxoSets);
        return utxos;
    }

    public async getAddressTransactionCounts(_addresses: AddressType[]) {
        const addresses = _addresses.map((a) => a.toString());
        const transactionCountsArray = await Promise.all(
            addresses.map(async (addr) => {
                const txCount = await this._getAddressTransactionCount(addr);
                return { [addr]: txCount };
            })
        );
        const transactionCounts = Object.assign({}, ...transactionCountsArray);
        return transactionCounts;
    }

    public async getMinRelayFee() {
        return 1;
    }

    private async _getUnspentTransactions(address: string): Promise<UTXO[]> {
        const data: EsploraTypes.UTXO[] = await this.httpClient.nodeGet(`/address/${address}/utxo`);
        return data.map((utxo) => ({
            ...utxo,
            address,
            value: utxo.value,
            blockHeight: utxo.status.block_height,
        }));
    }

    private async _getAddressTransactionCount(address: string) {
        const data: EsploraTypes.Address = await this.httpClient.nodeGet(`/address/${address}`);
        return data.chain_stats.tx_count + data.mempool_stats.tx_count;
    }
}
