import { Swap } from '@chainify/client';
import { TxNotFoundError, UnimplementedMethodError } from '@chainify/errors';
import { AssetTypes, FeeType, SwapParams, Transaction } from '@chainify/types';
import { compare, ensure0x, Math, remove0x, validateSecret, validateSecretAndHash } from '@chainify/utils';
import { Signer } from '@ethersproject/abstract-signer';
import { AddressZero } from '@ethersproject/constants';
import { BaseProvider, Log } from '@ethersproject/providers';
import { LiqualityHTLC, LiqualityHTLC__factory } from '../typechain';
import { ClaimEvent, InitiateEvent, RefundEvent } from '../typechain/LiqualityHTLC';
import { EthersTransactionResponse, EvmSwapOptions } from '../types';
import { calculateGasMargin, parseSwapParams, toEthereumTxRequest } from '../utils';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';

export abstract class EvmBaseSwapProvider extends Swap<BaseProvider, Signer, EvmBaseWalletProvider<BaseProvider>> {
    protected walletProvider: EvmBaseWalletProvider<BaseProvider>;
    protected contract: LiqualityHTLC;
    protected swapOptions: EvmSwapOptions;

    constructor(swapOptions?: EvmSwapOptions, walletProvider?: EvmBaseWalletProvider<BaseProvider>) {
        super(walletProvider);

        this.swapOptions = {
            ...swapOptions,
            contractAddress: swapOptions?.contractAddress || '0x133713376F69C1A67d7f3594583349DFB53d8166',
            numberOfBlocksPerRequest: swapOptions?.numberOfBlocksPerRequest || 2000,
            totalNumberOfBlocks: swapOptions?.totalNumberOfBlocks || 100_000,
            gasLimitMargin: swapOptions?.gasLimitMargin || 1000, // 10%
        };

        if (walletProvider) {
            this.contract = LiqualityHTLC__factory.connect(this.swapOptions.contractAddress, this.walletProvider.getSigner());
        }
    }

    public async initiateSwap(swapParams: SwapParams, fee: FeeType): Promise<Transaction<EthersTransactionResponse>> {
        this.validateSwapParams(swapParams);
        const parsedSwapParams = parseSwapParams(swapParams);
        const value = swapParams.asset.type === AssetTypes.native ? parsedSwapParams.amount : 0;
        const tx = await this.contract.populateTransaction.initiate(parsedSwapParams, { value });
        const estimatedGasLimit = await this.contract.estimateGas.initiate(parsedSwapParams, { value });
        return await this.walletProvider.sendTransaction(
            toEthereumTxRequest({ ...tx, gasLimit: calculateGasMargin(estimatedGasLimit, this.swapOptions.gasLimitMargin) }, fee)
        );
    }

    public async claimSwap(
        swapParams: SwapParams,
        initTxHash: string,
        secret: string,
        fee: FeeType
    ): Promise<Transaction<EthersTransactionResponse>> {
        validateSecret(secret);
        validateSecretAndHash(secret, swapParams.secretHash);

        const transaction: Transaction<InitiateEvent> = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, transaction);

        if (transaction?.logs) {
            for (const log of transaction.logs as Log[]) {
                const initiate = this.tryParseLog(log);

                if (initiate?.args?.id) {
                    const secret0x = ensure0x(secret);
                    const tx = await this.contract.populateTransaction.claim(initiate.args.id, secret0x);
                    const estimatedGasLimit = await this.contract.estimateGas.claim(initiate.args.id, secret0x);
                    const txResponse = await this.walletProvider.sendTransaction(
                        toEthereumTxRequest(
                            { ...tx, gasLimit: calculateGasMargin(estimatedGasLimit, this.swapOptions.gasLimitMargin) },
                            fee
                        )
                    );
                    return txResponse;
                }
            }
        }
    }

    public async refundSwap(swapParams: SwapParams, initTxHash: string, fee: FeeType): Promise<Transaction<EthersTransactionResponse>> {
        const transaction = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);

        await this.verifyInitiateSwapTransaction(swapParams, transaction);

        if (transaction?.logs) {
            for (const log of transaction.logs as Log[]) {
                const initiate = this.tryParseLog(log);

                if (initiate?.args?.id) {
                    const tx = await this.contract.populateTransaction.refund(initiate.args.id);
                    const estimatedGasLimit = await this.contract.estimateGas.refund(initiate.args.id);
                    const txResponse = await this.walletProvider.sendTransaction(
                        toEthereumTxRequest(
                            { ...tx, gasLimit: calculateGasMargin(estimatedGasLimit, this.swapOptions.gasLimitMargin) },
                            fee
                        )
                    );
                    return txResponse;
                }
            }
        }
    }

    public async getSwapSecret(claimTx: string): Promise<string> {
        const transaction: Transaction<ClaimEvent> = await this.walletProvider.getChainProvider().getTransactionByHash(claimTx);

        if (!transaction) {
            throw new TxNotFoundError(`Transaction not found: ${claimTx}`);
        }

        if (transaction?.logs) {
            for (const log of transaction.logs as Log[]) {
                const claim = this.tryParseLog(log);
                if (claim?.args?.id && claim.args.secret) {
                    return remove0x(claim.args.secret);
                }
            }
        }
    }

    public canUpdateFee(): boolean {
        return false;
    }

    public updateTransactionFee(_tx: string | Transaction<any>, _newFee: FeeType): Promise<Transaction> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    protected onWalletProviderUpdate(wallet: EvmBaseWalletProvider<BaseProvider, Signer>): void {
        this.contract = LiqualityHTLC__factory.connect(this.swapOptions.contractAddress, wallet.getSigner());
    }

    protected doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<InitiateEvent>): boolean {
        let htlcArgs = transaction?._raw?.args;

        if (!htlcArgs) {
            if (transaction?.logs) {
                for (const log of transaction.logs as Log[]) {
                    const initiate = this.tryParseLog(log);
                    if (initiate) {
                        htlcArgs = initiate.args as any;
                    }
                }
            }
        }

        if (htlcArgs) {
            return (
                Math.eq(htlcArgs.htlc.amount, swapParams.value) &&
                Math.eq(htlcArgs.htlc.expiration, swapParams.expiration) &&
                compare(htlcArgs.htlc.recipientAddress, ensure0x(swapParams.recipientAddress.toString())) &&
                compare(htlcArgs.htlc.refundAddress, ensure0x(swapParams.refundAddress.toString())) &&
                compare(
                    htlcArgs.htlc.tokenAddress,
                    swapParams.asset.type === AssetTypes.native ? AddressZero : swapParams.asset.contractAddress
                ) &&
                compare(ensure0x(htlcArgs.htlc.secretHash), ensure0x(swapParams.secretHash))
            );
        }
    }

    protected tryParseLog(log: Log) {
        try {
            return this.contract.interface.parseLog(log);
        } catch (err) {
            if (err.code === 'INVALID_ARGUMENT' && err.argument === 'topichash') {
                return null;
            } else {
                throw err;
            }
        }
    }

    abstract findInitiateSwapTransaction(swapParams: SwapParams, _blockNumber?: number): Promise<Transaction<InitiateEvent>>;

    abstract findRefundSwapTransaction(swapParams: SwapParams, initTxHash: string, blockNumber?: number): Promise<Transaction<RefundEvent>>;

    abstract findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string, _blockNumber?: number): Promise<Transaction<ClaimEvent>>;
}
