import { Chain, Fee, JsonRpcProvider } from '@chainify/client';
import { BlockNotFoundError, TxNotFoundError } from '@chainify/errors';
import { AddressType, Asset, BigNumber, Block, FeeDetail, FeeDetails, Transaction } from '@chainify/types';
import { flatten } from 'lodash';
import { Transaction as BitcoinTransaction } from '../../types';
import { normalizeTransactionObject } from '../../utils';
import { BitcoinJsonRpcBaseProvider } from './BitcoinJsonRpcBaseProvider';
import { Block as BitcoinRpcBlock, FeeOptions, MinedTransaction, ProviderOptions } from './types';

export class BitcoinJsonRpcProvider extends Chain<BitcoinJsonRpcBaseProvider> {
    public jsonRpc: JsonRpcProvider;
    private _feeOptions: FeeOptions;

    constructor(options: ProviderOptions, feeProvider?: Fee, feeOptions?: FeeOptions) {
        super(options.network, new BitcoinJsonRpcBaseProvider(options), feeProvider);
        this.jsonRpc = this.provider.jsonRpc;
        this._feeOptions = { slowTargetBlocks: 6, averageTargetBlocks: 3, fastTargetBlocks: 1, ...feeOptions };
    }

    public async getBlockByHash(blockHash: string, includeTx = false): Promise<Block> {
        let data: BitcoinRpcBlock;

        try {
            data = await this.jsonRpc.send('getblock', [blockHash]); // TODO: This doesn't fit the interface?: https://chainquery.com/bitcoin-cli/getblock
        } catch (e) {
            if (e.name === 'NodeError' && e.message.includes('Block not found')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, message, ...attrs } = e;
                throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs);
            }

            throw e;
        }

        const {
            hash,
            height: number,
            mediantime: timestamp,
            difficulty,
            size,
            previousblockhash: parentHash,
            nonce,
            tx: transactionHashes,
        } = data;

        let transactions: any[] = transactionHashes;
        // TODO: Why transactions need to be retrieved individually? getblock has verbose 2 https://chainquery.com/bitcoin-cli/getblock
        if (includeTx) {
            const txs = transactionHashes.map((hash) => this.getTransactionByHash(hash));
            transactions = await Promise.all(txs);
        }

        return {
            hash,
            number,
            timestamp,
            difficulty: parseFloat(new BigNumber(difficulty).toFixed()),
            size,
            parentHash,
            nonce,
            transactions,
            _raw: data,
        };
    }

    public async getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block<any, any>> {
        if (!blockNumber) {
            blockNumber = await this.getBlockHeight();
        }

        let blockHash;

        try {
            blockHash = await this.jsonRpc.send('getblockhash', [blockNumber]);
        } catch (e) {
            if (e.name === 'NodeError' && e.message.includes('Block height out of range')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, message, ...attrs } = e;
                throw new BlockNotFoundError(`Block not found: ${blockNumber}`, attrs);
            }

            throw e;
        }

        return this.getBlockByHash(blockHash, includeTx);
    }

    public async getBlockHeight(): Promise<number> {
        return this.jsonRpc.send('getblockcount', []);
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
        try {
            const tx = await this.getParsedTransactionByHash(txHash, true);
            return tx;
        } catch (e) {
            if (e.name === 'NodeError' && e.message.includes('No such mempool transaction')) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, message, ...attrs } = e;
                throw new TxNotFoundError(`Transaction not found: ${txHash}`, attrs);
            }

            throw e;
        }
    }

    public async getBalance(_addresses: AddressType[], _assets: Asset[]): Promise<BigNumber[]> {
        const addresses = _addresses.map((a) => a.toString());
        const _utxos = await this.provider.getUnspentTransactions(addresses);
        const utxos = flatten(_utxos);
        return [utxos.reduce((acc, utxo) => acc.plus(utxo.value), new BigNumber(0))];
    }

    public async getFees(): Promise<FeeDetails> {
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
        return this.jsonRpc.send('sendrawtransaction', [rawTransaction]);
    }

    public async sendRpcRequest(method: string, params: any[]): Promise<any> {
        return this.jsonRpc.send(method, params);
    }

    private async getParsedTransactionByHash(transactionHash: string, addFees = false): Promise<Transaction<BitcoinTransaction>> {
        const tx: MinedTransaction = await this.jsonRpc.send('getrawtransaction', [transactionHash, 1]);
        return normalizeTransactionObject(
            tx,
            addFees ? await this.getTransactionFee(tx) : undefined,
            tx.confirmations > 0 ? await this.getBlockByHash(tx.blockhash) : undefined
        );
    }

    private async getTransactionFee(tx: BitcoinTransaction) {
        const isCoinbaseTx = tx.vin.find((vin) => vin.coinbase);
        if (isCoinbaseTx) return; // Coinbase transactions do not have a fee

        const inputs = tx.vin.map((vin) => ({ txid: vin.txid, vout: vin.vout }));
        const inputTransactions = await Promise.all(inputs.map((input) => this.jsonRpc.send('getrawtransaction', [input.txid, 1])));

        const inputValues = inputTransactions.map((inputTx, index) => {
            const vout = inputs[index].vout;
            const output = inputTx.vout[vout];
            return output.value * 1e8;
        });
        const inputValue = inputValues.reduce((a, b) => a.plus(new BigNumber(b)), new BigNumber(0));
        const outputValue = tx.vout.reduce((a, b) => a.plus(new BigNumber(b.value).times(new BigNumber(1e8))), new BigNumber(0));
        const feeValue = inputValue.minus(outputValue);
        return feeValue.toNumber();
    }

    private async _getFee(targetBlocks: number): Promise<FeeDetail> {
        const value = await this.provider.getFeePerByte(targetBlocks);
        const wait = targetBlocks * 10 * 60; // 10 minute blocks in seconds
        return { fee: value, wait };
    }
}
