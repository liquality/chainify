import { Swap } from '@liquality/client';
import { StandardError, UnimplementedMethodError } from '@liquality/errors';
import { FeeType, SwapParams, Transaction } from '@liquality/types';
import { validateSecret, validateSecretAndHash } from '@liquality/utils';
import { isTxError, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { TerraWalletProvider } from 'lib';
import { assetCodeToDenom } from 'lib/constants';
import { TerraTxInfo } from '../types';

export class TerraSwapProvider extends Swap<any, any, TerraWalletProvider> {
    public async initiateSwap(swapParams: SwapParams, fee?: FeeType): Promise<Transaction<TerraTxInfo>> {
        const address = await this.walletProvider.getAddress();

        const { codeId } = await this.walletProvider.getConnectedNetwork();

        const initMsg = [
            new MsgInstantiateContract(
                // user
                address.toString(),
                // admin
                null,
                // bytecode
                codeId,
                // swap params
                {
                    buyer: swapParams.recipientAddress,
                    seller: swapParams.refundAddress,
                    expiration: swapParams.expiration,
                    value: swapParams.value.toNumber(),
                    secret_hash: swapParams.secretHash,
                },
                // msg value
                { [assetCodeToDenom[swapParams.asset.code]]: swapParams.value.toNumber() }
            ),
        ];

        return this.walletProvider.sendTransaction({ msgs: initMsg, fee, feeAsset: swapParams.asset });
    }

    public async findInitiateSwapTransaction(_swapParams: SwapParams, _blockNumber?: number): Promise<Transaction<TerraTxInfo>> {
        throw new Error('Method not implemented.');
    }

    public async claimSwap(
        swapParams: SwapParams,
        initiationTxHash: string,
        secret: string,
        fee?: FeeType
    ): Promise<Transaction<TerraTxInfo>> {
        validateSecret(secret);
        validateSecretAndHash(secret, swapParams.secretHash);

        const txReceipt: Transaction<TerraTxInfo> = await this.walletProvider.getChainProvider().getTransactionByHash(initiationTxHash);
        await this.verifyInitiateSwapTransaction(swapParams, txReceipt);

        const address = await this.walletProvider.getAddress();
        const claimMsg = [new MsgExecuteContract(address.toString(), txReceipt.to.toString(), { claim: { secret } })];
        return this.walletProvider.sendTransaction({ msgs: claimMsg, fee, feeAsset: swapParams.asset });
    }

    public async findClaimSwapTransaction(
        _swapParams: SwapParams,
        _initTxHash: string,
        _blockNumber?: number
    ): Promise<Transaction<TerraTxInfo>> {
        throw new Error('Method not implemented.');
    }

    public async refundSwap(swapParams: SwapParams, initTx: string, fee?: FeeType): Promise<Transaction<TerraTxInfo>> {
        const txReceipt = await this.walletProvider.getChainProvider().getTransactionByHash(initTx);
        await this.verifyInitiateSwapTransaction(swapParams, txReceipt);

        const address = await this.walletProvider.getAddress();
        const refundMsg = [new MsgExecuteContract(address.toString(), txReceipt.to.toString(), { refund: {} })];
        return this.walletProvider.sendTransaction({ msgs: refundMsg, fee, feeAsset: swapParams.asset });
    }

    public async findRefundSwapTransaction(
        _swapParams: SwapParams,
        _initiationTxHash: string,
        _blockNumber?: number
    ): Promise<Transaction<TerraTxInfo>> {
        throw new Error('Method not implemented.');
    }

    public async getSwapSecret(claimTxHash: string, _initTxHash?: string): Promise<string> {
        const claimTxReceipt = await this.walletProvider.getChainProvider().getTransactionByHash(claimTxHash);
        return claimTxReceipt.secret;
    }

    protected async doesTransactionMatchInitiation(swapParams: SwapParams, initTx: Transaction<TerraTxInfo>): Promise<boolean> {
        const network = await this.walletProvider.getConnectedNetwork();

        if (isTxError(initTx._raw)) {
            throw new StandardError(`Encountered an error while running the transaction: ${initTx._raw.htlc} ${initTx.hash}`);
        }

        const txCodeId = initTx._raw.htlc?.code_id;

        if (txCodeId !== network.codeId) {
            throw new StandardError(`Transaction is from different template: ${txCodeId}`);
        }

        const txParams = initTx._raw.htlc;

        return (
            swapParams.recipientAddress === txParams?.buyer &&
            swapParams.refundAddress === txParams.seller &&
            swapParams.secretHash === txParams.secret_hash &&
            swapParams.expiration === txParams.expiration &&
            swapParams.value.eq(initTx.value)
        );
    }

    public canUpdateFee(): boolean {
        return false;
    }

    public async updateTransactionFee(_tx: string | Transaction<TerraTxInfo>, _newFee: FeeType): Promise<Transaction<TerraTxInfo>> {
        throw new UnimplementedMethodError('Method not supported.');
    }
}
