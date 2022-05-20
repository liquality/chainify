import { Chain, Fee, HttpClient } from '@chainify/client';
import { BlockNotFoundError, TxNotFoundError } from '@chainify/errors';
import { AddressType, BigNumber, Block, FeeDetail, FeeDetails, Transaction } from '@chainify/types';
import { flatten } from 'lodash';
import { BitcoinEsploraBaseProvider } from './BitcoinEsploraBaseProvider';
import { BitcoinEsploraBatchBaseProvider } from './BitcoinEsploraBatchBaseProvider';
import * as EsploraTypes from './types';

export class BitcoinEsploraApiProvider extends Chain<BitcoinEsploraBaseProvider> {
    private _httpClient: HttpClient;
    private _feeOptions: EsploraTypes.FeeOptions;

    constructor(
        options: EsploraTypes.EsploraBatchApiProviderOptions,
        provider?: BitcoinEsploraBaseProvider,
        feeProvider?: Fee,
        feeOptions?: EsploraTypes.FeeOptions
    ) {
        const _provider = provider || new BitcoinEsploraBatchBaseProvider(options);
        super(options.network, _provider, feeProvider);
        this._httpClient = this.provider.httpClient;
        this._feeOptions = { slowTargetBlocks: 6, averageTargetBlocks: 3, fastTargetBlocks: 1, ...feeOptions };
    }

    public async getBlockByHash(blockHash: string): Promise<Block<any, any>> {
        let data;

        try {
            data = await this._httpClient.nodeGet(`/block/${blockHash}`);
        } catch (e) {
            if (e.name === 'NodeError' && e.message.includes('Block not found')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, message, ...attrs } = e;
                throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs);
            }

            throw e;
        }

        const { id: hash, height: number, timestamp, mediantime, size, previousblockhash: parentHash, difficulty, nonce } = data;

        return {
            hash,
            number,
            timestamp: mediantime || timestamp,
            size,
            parentHash,
            difficulty,
            nonce,
            _raw: data,
        };
    }

    public async getBlockByNumber(blockNumber?: number): Promise<Block<any, any>> {
        if (!blockNumber) {
            blockNumber = await this.getBlockHeight();
        }
        return this.getBlockByHash(await this._getBlockHash(blockNumber));
    }

    public async getBlockHeight(): Promise<number> {
        const data = await this._httpClient.nodeGet('/blocks/tip/height');
        return parseInt(data);
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
        return this.getTransaction(txHash);
    }

    public async getBalance(_addresses: AddressType[]): Promise<BigNumber[]> {
        const addresses = _addresses.map((a) => a.toString());
        const _utxos = await this.provider.getUnspentTransactions(addresses);
        const utxos = flatten(_utxos);
        return [utxos.reduce((acc, utxo) => acc.plus(utxo.value), new BigNumber(0))];
    }

    async getFees(): Promise<FeeDetails> {
        if (this.feeProvider) {
            return this.feeProvider.getFees();
        } else {
            const [slow, average, fast] = await Promise.all([
                this._getFee(this._feeOptions.slowTargetBlocks),
                this._getFee(this._feeOptions.averageTargetBlocks),
                this._getFee(this._feeOptions.fastTargetBlocks),
            ]);

            return {
                slow,
                average,
                fast,
            };
        }
    }

    public async sendRawTransaction(rawTransaction: string): Promise<string> {
        return this._httpClient.nodePost('/tx', rawTransaction);
    }

    public async sendRpcRequest(_method: string, _params: any[]): Promise<any> {
        throw new Error('Method not implemented.');
    }

    private async _getBlockHash(blockNumber: number): Promise<string> {
        return this._httpClient.nodeGet(`/block-height/${blockNumber}`);
    }

    private async getTransaction(transactionHash: string) {
        let data: EsploraTypes.Transaction;

        try {
            data = await this._httpClient.nodeGet(`/tx/${transactionHash}`);
        } catch (e) {
            if (e.name === 'NodeError' && e.message.includes('Transaction not found')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, message, ...attrs } = e;
                throw new TxNotFoundError(`Transaction not found: ${transactionHash}`, attrs);
            }

            throw e;
        }

        const currentHeight = await this.getBlockHeight();
        return this.provider.formatTransaction(data, currentHeight);
    }

    private async _getFee(targetBlocks: number): Promise<FeeDetail> {
        const value = await this.provider.getFeePerByte(targetBlocks);
        const wait = targetBlocks * 10 * 60; // 10 minute blocks in seconds
        return { fee: value, wait };
    }
}
