import { Chain } from '@liquality/client';
import { UnsupportedMethodError } from '@liquality/errors';
import { AddressType, Asset, BigNumber, Block, FeeDetails, Network, Transaction } from '@liquality/types';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { parseBlockResponse, parseTransactionResponse } from 'lib/utils';

export class SolanaChainProvider extends Chain<Connection, Network> {
    constructor(network: Network) {
        super(network);

        if (!this.provider && this.network.rpcUrl) {
            this.provider = new Connection(network.rpcUrl, 'confirmed');
        }
    }

    getBlockByHash(_blockHash: string): Promise<Block<any, any>> {
        throw new UnsupportedMethodError('Method not supported for Solana');
    }

    public async getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block<Block, Transaction>> {
        const block = await this.provider.getBlock(blockNumber);

        if (!includeTx) {
            return parseBlockResponse(block);
        }

        const transactions = block.transactions.map((tr: any) => parseTransactionResponse(tr));

        return {
            ...parseBlockResponse(block),
            transactions,
        };
    }

    public async getBlockHeight(): Promise<number> {
        return await this.provider.getBlockHeight();
    }

    public async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
        const [transaction, signatureStatus] = await Promise.all([
            this.provider.getParsedTransaction(txHash),
            this.provider.getSignatureStatus(txHash, { searchTransactionHistory: true }),
        ]);

        return parseTransactionResponse(transaction, signatureStatus);
    }

    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]> {
        const address = new PublicKey(addresses[0].toString());

        const [nativeBalance, tokenData] = await Promise.all([
            this.provider.getBalance(address),
            this.provider.getTokenAccountsByOwner(address, { programId: TOKEN_PROGRAM_ID }),
        ]);

        const tokenBalances: { contractAddress: String; amount: BigNumber }[] = [];
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
}
