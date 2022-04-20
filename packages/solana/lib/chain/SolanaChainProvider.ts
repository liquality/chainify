import { Chain } from '@liquality/client';
import { BlockNotFoundError, TxNotFoundError, UnsupportedMethodError } from '@liquality/errors';
import { Logger } from '@liquality/logger';
import { AddressType, Asset, BigNumber, Block, FeeDetails, Network, Transaction } from '@liquality/types';
import { retry } from '@liquality/utils';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BlockResponse, Connection, PublicKey } from '@solana/web3.js';
import { parseBlockResponse, parseTransactionResponse } from '../utils';

const logger = new Logger('SolanaWalletProvider');

export class SolanaChainProvider extends Chain<Connection, Network> {
    constructor(network: Network) {
        super(network);

        if (!this.provider && this.network.rpcUrl) {
            this.provider = new Connection(network.rpcUrl, 'confirmed');
        }
    }

    public async getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block<BlockResponse, Transaction>> {
        return retry(async () => {
            try {
                const block = await this.provider.getBlock(blockNumber);

                if (!includeTx) {
                    return parseBlockResponse(block);
                }

                const txSignatures = block.transactions.map((tx) => tx.transaction.signatures[0]);
                const txDetails = await this.provider.getParsedTransactions(txSignatures);
                const transactions = txDetails.map((tx) => parseTransactionResponse(tx));

                return { ...parseBlockResponse(block), transactions };
            } catch (err) {
                logger.error(err);
                throw new BlockNotFoundError(`Block ${blockNumber} not found`);
            }
        });
    }

    public async getBlockHeight(): Promise<number> {
        return await this.provider.getSlot();
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction> {
        return retry(async () => {
            try {
                const [transaction, signatures] = await Promise.all([
                    this.provider.getParsedTransaction(txHash),
                    this.provider.getSignatureStatus(txHash, { searchTransactionHistory: true }),
                ]);
                return parseTransactionResponse(transaction, signatures);
            } catch (err) {
                logger.error(err);
                throw new TxNotFoundError(`Transaction not found: ${txHash}`);
            }
        });
    }

    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]> {
        const address = new PublicKey(addresses[0].toString());

        const [nativeBalance, tokenData] = await Promise.all([
            this.provider.getBalance(address),
            this.provider.getTokenAccountsByOwner(address, { programId: TOKEN_PROGRAM_ID }),
        ]);

        const tokenBalances: { contractAddress: string; amount: BigNumber }[] = [];
        tokenData.value.forEach((token) => {
            const { mint, amount } = AccountLayout.decode(token.account.data);

            tokenBalances.push({
                contractAddress: mint.toString(),
                amount: new BigNumber(amount.toString()),
            });
        });

        const balances: BigNumber[] = [];
        assets.forEach((asset) => {
            if (asset.isNative) {
                balances.push(new BigNumber(nativeBalance));
            } else {
                const token = tokenBalances.find((token) => token.contractAddress === asset.contractAddress);

                if (token) {
                    balances.push(token.amount);
                }
            }
        });

        return balances;
    }

    public async getFees(): Promise<FeeDetails> {
        const lamportsPerSignature = 5000;

        return {
            slow: {
                fee: lamportsPerSignature,
            },
            average: {
                fee: lamportsPerSignature * 1.5,
            },
            fast: {
                fee: lamportsPerSignature * 2,
            },
        };
    }

    public async sendRawTransaction(rawTransaction: string): Promise<string> {
        const wireTransaciton = Buffer.from(rawTransaction);
        return await this.provider.sendRawTransaction(wireTransaciton);
    }

    public async sendRpcRequest(_method: string, _params: any[]): Promise<void> {
        throw new UnsupportedMethodError('Method not supported for Solana');
    }

    public async getBlockByHash(_blockHash: string): Promise<Block<Block, Transaction>> {
        throw new UnsupportedMethodError('Method not supported for Solana');
    }
}
