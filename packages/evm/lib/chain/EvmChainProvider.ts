import { Chain, Fee } from '@chainify/client';
import { BlockNotFoundError, NodeError, TxNotFoundError, UnsupportedMethodError } from '@chainify/errors';
import { Logger } from '@chainify/logger';
import { AddressType, Asset, BigNumber, Block, FeeDetails, Network, TokenDetails, Transaction } from '@chainify/types';
import { ensure0x } from '@chainify/utils';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { RpcFeeProvider } from '../fee/RpcFeeProvider';
import { ERC20__factory } from '../typechain';
import { EthersBlock, EthersBlockWithTransactions, EthersTransactionResponse } from '../types';
import { parseBlockResponse, parseTxResponse } from '../utils';
import { EvmMulticallProvider } from './EvmMulticallProvider';

/**
 * Represents a connection to any EVM network.
 * Used to fetch chain specific data like blocks, transactions, balances and fees. It uses {@link https://docs.ethers.io/v5/api | ethersjs}
 *
 * Example:
 * ```typescript
 * import { providers } from 'ethers';
 * import { EvmNetworks, EvmChainProvider } from '@chainify/evm';
 *
 * const provider = new providers.StaticJsonRpcProvider(EvmNetworks.ganache.rpcUrl);
 * const chainProvider = new EvmChainProvider(EvmNetworks.ganache, provider, null);
 * ```
 * @public
 *
 */
export class EvmChainProvider extends Chain<StaticJsonRpcProvider> {
    public multicall: EvmMulticallProvider;
    private _logger: Logger;

    /**
     * @param network - See {@link EvmNetworks}
     * @param provider - Instance of {@link https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider | StaticJsonRpcProvider}
     * If not passed, it's created internally based on the `rpcUrl` from the network parameter.
     * @param feeProvider - Instance of {@link Fee}.
     * If not passed, it uses {@link https://docs.ethers.io/v5/api/providers/provider/#Provider-getFeeData | getFeeData} from the ethers provider.
     */
    constructor(network: Network, provider?: StaticJsonRpcProvider, feeProvider?: Fee, multicall = true) {
        super(network, provider, feeProvider);

        this._logger = new Logger(`EvmChainProvider ${network.chainId}`);

        if (!provider && this.network.rpcUrl) {
            this.provider = new StaticJsonRpcProvider(this.network.rpcUrl, this.network.chainId);
        }

        if (!feeProvider) {
            this.feeProvider = new RpcFeeProvider(this.provider);
        }

        if (multicall) {
            this.multicall = new EvmMulticallProvider(this.provider);
        }
    }

    /**
     * Used to fetch the name, decimals and symbols of an ERC20 token
     * @param asset - the address of the token contract
     * @returns
     */
    public async getTokenDetails(asset: string): Promise<TokenDetails> {
        try {
            if (this.multicall) {
                const [decimals, name, symbol] = await this.multicall.multicall(
                    ['decimals', 'name', 'symbol'].map((method) => {
                        return {
                            target: asset,
                            abi: ERC20__factory.abi,
                            name: method,
                            params: [],
                        };
                    })
                );
                return { decimals, name, symbol };
            } else {
                const token = ERC20__factory.connect(asset, this.provider);
                const [decimals, name, symbol] = await Promise.all([token.decimals(), token.name(), token.symbol()]);
                return { decimals, name, symbol };
            }
        } catch (err) {
            this._logger.error(err);
            throw new NodeError(`Cannot fetch details for ${asset}`);
        }
    }

    /**
     * @param blockHash - the hash of the block
     * @returns
     * If `includeTx` is `false` the `_raw` object type is {@link https://docs.ethers.io/v5/api/providers/types/#providers-Block | EthersBlock}.
     *
     * If `includeTx` is `true`  the `_raw` object type {@link https://docs.ethers.io/v5/api/providers/types/#providers-BlockWithTransactions | BlockWithTransactions}
     * and `transactions` array with type {@link https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse | EthersTransactionResponse}
     */
    public async getBlockByHash(
        blockHash: string,
        includeTx = false
    ): Promise<Block<EthersBlock | EthersBlockWithTransactions, EthersTransactionResponse>> {
        return this._getBlock(ensure0x(blockHash), includeTx);
    }

    /**
     * @param blockNumber - the number of the block. If not passed, it fetches the latest block
     * @returns
     * If `includeTx` is `false` the `_raw` object type is {@link https://docs.ethers.io/v5/api/providers/types/#providers-Block | EthersBlock}.
     *
     * If `includeTx` is `true`  the `_raw` object type {@link https://docs.ethers.io/v5/api/providers/types/#providers-BlockWithTransactions | BlockWithTransactions}
     * and `transactions` array with type {@link https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse | EthersTransactionResponse}
     */
    public async getBlockByNumber(
        blockNumber?: number,
        includeTx = false
    ): Promise<Block<EthersBlock | EthersBlockWithTransactions, EthersTransactionResponse>> {
        if (!blockNumber) {
            blockNumber = await this.getBlockHeight();
        }
        return this._getBlock(blockNumber, includeTx);
    }

    /**
     * @returns resolves with the latest block number
     */
    public async getBlockHeight(): Promise<number> {
        return this.provider.getBlockNumber();
    }

    /**
     * @param txHash - the transaction hash prefixed with `0x`
     * @returns a transaction object with _raw object type
     * of {@link https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse | EthersTransactionResponse}
     */
    public async getTransactionByHash(txHash: string): Promise<Transaction<EthersTransactionResponse>> {
        const _txHash = ensure0x(txHash);

        const tx = await this.provider.getTransaction(_txHash);
        if (!tx) {
            throw new TxNotFoundError('Transaction not found');
        }
        const result = parseTxResponse(tx);

        if (result.confirmations > 0) {
            const receipt = await this.provider.getTransactionReceipt(_txHash);
            return parseTxResponse(tx, receipt);
        }

        return result;
    }

    /**
     * @param addresses - currently fetches the balances only for `addresses[0]`
     * @param assets - the list of assets
     * @returns - the balances of `assets` in the passed order
     */
    public async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]> {
        const user = addresses[0].toString();

        if (this.multicall) {
            const balances = await this.multicall.getMultipleBalances(user, assets);
            return balances.map((b) => new BigNumber(b.toString()));
        } else {
            const allBalancePromise = assets.map((a) => {
                if (a.isNative) {
                    return this.provider.getBalance(user);
                } else {
                    return ERC20__factory.connect(a.contractAddress, this.provider).balanceOf(user);
                }
            });
            return (await Promise.all(allBalancePromise)).map((b) => new BigNumber(b.toString()));
        }
    }

    /**
     * @param rawTransaction - the signed transaction
     * @returns the hash of the transaction
     */
    public async sendRawTransaction(rawTransaction: string): Promise<string> {
        const tx = await this.provider.sendTransaction(ensure0x(rawTransaction));
        return tx.hash;
    }

    /**
     * If the `feeProvider` is not defined, it fetches the fees from {@link https://docs.ethers.io/v5/api/providers/provider/#Provider-getFeeData | getFeeData}
     */
    public async getFees(): Promise<FeeDetails> {
        return this.feeProvider.getFees();
    }

    /**
     * @throws {@link UnsupportedMethodError} if the ethers provider doesn't support rpc calls
     */
    public async sendRpcRequest(method: string, params: any[]): Promise<any> {
        if (!this.provider.send) {
            throw new UnsupportedMethodError('Method not supported.');
        }
        return this.provider.send(method, params);
    }

    private async _getBlock(blockTag: number | string, includeTx?: boolean) {
        if (includeTx) {
            const blockWithTx = await this.provider.getBlockWithTransactions(blockTag);
            if (!blockWithTx) {
                throw new BlockNotFoundError(blockTag);
            }
            return parseBlockResponse(blockWithTx, blockWithTx.transactions);
        } else {
            const block = await this.provider.getBlock(blockTag);
            if (!block) {
                throw new BlockNotFoundError(blockTag);
            }
            return parseBlockResponse(block);
        }
    }
}
