import { TxNotFoundError } from '@liquality/errors';
import { ClientTypes, HttpClient, Swap, Wallet } from '@liquality/client';
import { SwapParams, Transaction, BigNumberish } from '@liquality/types';
import { compare, Math, remove0x, validateSecret, validateSecretAndHash } from '@liquality/utils';

import { NearScraperData, NearTxLog, NearTxRequest, providers, InMemorySigner } from '../types';
import { getClaimActions, getHtlcActions, getRefundActions, parseScraperTransaction } from '../utils';

const ONE_DAY_IN_NS = 24 * 60 * 60 * 1000 * 1000 * 1000;
const CONTRACT_CODE = 'jrBWhtpuyGJ44vtP+Ib+I32tuUUtfKQBuBdQ8y3M6Ro=';

export class NearSwapProvider extends Swap<providers.JsonRpcProvider, InMemorySigner> {
    private _httpClient: HttpClient;

    constructor(httpConfig: ClientTypes.AxiosRequestConfig, walletProvider: Wallet<providers.JsonRpcProvider, InMemorySigner>) {
        super(walletProvider);
        this._httpClient = new HttpClient(httpConfig);
    }

    public async initiateSwap(swapParams: SwapParams): Promise<Transaction<NearTxLog>> {
        this.validateSwapParams(swapParams);
        return this.walletProvider.sendTransaction({
            to: this.generateUniqueString(swapParams.secretHash.substring(0, 20)),
            value: null,
            actions: getHtlcActions(swapParams),
        } as NearTxRequest);
    }

    public async findInitiateSwapTransaction(swapParams: SwapParams, _blockNumber?: BigNumberish): Promise<Transaction<NearTxLog>> {
        return await this.findAddressTransaction(swapParams.refundAddress.toString(), (tx: Transaction<NearTxLog>) =>
            this.doesTransactionMatchInitiation(swapParams, tx)
        );
    }

    public async claimSwap(swapParams: SwapParams, initTxHash: string, secret: string): Promise<Transaction<NearTxLog>> {
        validateSecret(secret);
        validateSecretAndHash(secret, swapParams.secretHash);

        const transaction = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, transaction);

        return this.walletProvider.sendTransaction({
            to: transaction.to,
            value: null,
            actions: getClaimActions(secret),
        } as NearTxRequest);
    }

    public async findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<NearTxLog>> {
        this.validateSwapParams(swapParams);

        const initTx = (await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash)) as Transaction<NearTxLog>;
        if (!initTx) {
            throw new TxNotFoundError(`Transaction receipt is not available: ${initTxHash}`);
        }

        const tx = await this.findAddressTransaction(initTx._raw.receiver.toString(), (tx) => tx?._raw?.htlc?.method === 'claim');

        if (tx?._raw?.htlc?.secret) {
            validateSecretAndHash(tx?._raw?.htlc?.secret, swapParams.secretHash);
            return tx;
        }
    }

    public async refundSwap(swapParams: SwapParams, initTxHash: string): Promise<Transaction<NearTxLog>> {
        const transaction = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, transaction);

        return this.walletProvider.sendTransaction({
            to: transaction.to,
            value: null,
            actions: getRefundActions(),
        } as NearTxRequest);
    }

    public async findRefundSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<NearTxLog>> {
        this.validateSwapParams(swapParams);

        const initTx = (await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash)) as Transaction<NearTxLog>;
        if (!initTx) {
            throw new TxNotFoundError(`Transaction receipt is not available: ${initTxHash}`);
        }
        return await this.findAddressTransaction(initTx._raw.receiver.toString(), (tx) => tx?._raw?.htlc?.method === 'refund');
    }

    public async getSwapSecret(claimTxHash: string): Promise<string> {
        const tx = (await this.walletProvider.getChainProvider().getTransactionByHash(claimTxHash)) as Transaction<NearTxLog>;
        if (!tx) {
            throw new TxNotFoundError(`Transaction not found: ${claimTxHash}`);
        }
        return tx._raw.htlc.secret;
    }

    protected doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<NearTxLog>): boolean {
        if (transaction?._raw?.htlc) {
            return (
                compare(transaction._raw.code, CONTRACT_CODE) &&
                Math.eq(transaction._raw.value, swapParams.value) &&
                compare(transaction._raw.sender, swapParams.refundAddress.toString()) &&
                Math.eq(transaction._raw.htlc.expiration, swapParams.expiration) &&
                compare(transaction._raw.htlc.recipient, swapParams.recipientAddress.toString()) &&
                compare(remove0x(transaction._raw.htlc.secretHash), remove0x(swapParams.secretHash))
            );
        }
    }

    private generateUniqueString(name: string): string {
        return `htlc-${name}-${Date.now()}`;
    }

    private async findAddressTransaction(
        address: string,
        predicate: (tx: Transaction<NearTxLog>) => boolean,
        limit = 1024
    ): Promise<Transaction<NearTxLog>> {
        let offset = new Date().valueOf() * 1000 * 1000;

        for (let page = 1; ; page++) {
            const transactions = (await this._httpClient.nodeGet(
                `account/${address}/activity?offset=${offset}&limit=${limit}`
            )) as NearScraperData[];

            if (transactions.length === 0) {
                return;
            }

            const parsedTransactions = {} as { [key: string]: NearTxLog };

            for (const tx of transactions) {
                parsedTransactions[tx.hash] = {
                    ...parsedTransactions[tx.hash],
                    ...parseScraperTransaction(tx),
                } as NearTxLog;
            }

            const foundTx = Object.values(parsedTransactions).find((tx) => predicate({ _raw: tx } as any));

            if (foundTx) {
                const receipt = await this.walletProvider.getChainProvider().getTransactionByHash(foundTx.hash);
                return { ...receipt, ...foundTx };
            }

            offset = offset - ONE_DAY_IN_NS;
        }
    }
}
