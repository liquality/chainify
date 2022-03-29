import { Signer } from '@ethersproject/abstract-signer';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { BaseProvider, Log } from '@ethersproject/providers';
import { Swap } from '@liquality/client';
import { TxNotFoundError, UnimplementedMethodError } from '@liquality/errors';
import { FeeType, SwapParams, Transaction } from '@liquality/types';
import { compare, ensure0x, Math, remove0x, validateSecret, validateSecretAndHash } from '@liquality/utils';
import { ERC20__factory, LiqualityHTLC, LiqualityHTLC__factory } from '../typechain';
import { ClaimEvent, InitiateEvent, RefundEvent } from '../typechain/LiqualityHTLC';
import { EthersTransactionResponse, EvmSwapOptions } from '../types';
import { parseSwapParams, toEthereumTxRequest } from '../utils';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';

export abstract class EvmBaseSwapProvider extends Swap<BaseProvider, Signer> {
    protected walletProvider: EvmBaseWalletProvider<BaseProvider>;
    protected contract: LiqualityHTLC;
    protected swapOptions: EvmSwapOptions;

    constructor(swapOptions: EvmSwapOptions, walletProvider?: EvmBaseWalletProvider<BaseProvider>) {
        super(walletProvider);

        if (walletProvider) {
            this.contract = LiqualityHTLC__factory.connect(swapOptions.contractAddress, this.walletProvider.getSigner());
        }

        this.swapOptions = swapOptions;
    }

    public async initiateSwap(swapParams: SwapParams, fee: FeeType): Promise<Transaction<EthersTransactionResponse>> {
        this.validateSwapParams(swapParams);
        const parsedSwapParams = parseSwapParams(swapParams);

        if (!swapParams.asset.isNative) {
            const userAddress = await this.walletProvider.getAddress();
            const erc20Contract = ERC20__factory.connect(swapParams.asset.contractAddress, this.walletProvider.getSigner());
            const allowance = await erc20Contract.allowance(userAddress.toString(), this.swapOptions.contractAddress);
            if (Math.lt(allowance, swapParams.value)) {
                const approveTx = await erc20Contract.populateTransaction.approve(this.swapOptions.contractAddress, MaxUint256);
                await this.walletProvider.sendTransaction(toEthereumTxRequest(approveTx, fee));
            }
        }

        const tx = await this.contract.populateTransaction.initiate(parsedSwapParams, {
            value: swapParams.asset.isNative ? parsedSwapParams.amount : 0,
        });
        const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, fee));
        return txResponse;
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
                    const tx = await this.contract.populateTransaction.claim(initiate.args.id, ensure0x(secret));
                    const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, fee));
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
                    const txResponse = await this.walletProvider.sendTransaction(toEthereumTxRequest(tx, fee));
                    return txResponse;
                }
            }
        }
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
                compare(htlcArgs.htlc.recipientAddress, swapParams.recipientAddress.toString()) &&
                compare(htlcArgs.htlc.refundAddress, swapParams.refundAddress.toString()) &&
                compare(htlcArgs.htlc.tokenAddress, swapParams.asset.isNative ? AddressZero : swapParams.asset.contractAddress) &&
                compare(remove0x(htlcArgs.htlc.secretHash), remove0x(swapParams.secretHash))
            );
        }
    }

    async getSwapSecret(claimTx: string): Promise<string> {
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
