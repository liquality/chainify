import { Swap } from '@chainify/client';
import { UnsupportedMethodError } from '@chainify/errors';
import { FeeType, SwapParams, Transaction } from '@chainify/types';
import { compare, Math, validateSecret, validateSecretAndHash } from '@chainify/utils';
import { LCDClient, MnemonicKey, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { TerraWalletProvider } from '..';
import { assetCodeToDenom } from '../constants';
import { TerraTxInfo } from '../types';

export abstract class TerraSwapBaseProvider extends Swap<LCDClient, MnemonicKey, TerraWalletProvider> {
    public async initiateSwap(swapParams: SwapParams, fee?: FeeType): Promise<Transaction<TerraTxInfo>> {
        this.validateSwapParams(swapParams);

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
                    buyer: swapParams.recipientAddress.toString(),
                    seller: swapParams.refundAddress.toString(),
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

    public async refundSwap(swapParams: SwapParams, initTx: string, fee?: FeeType): Promise<Transaction<TerraTxInfo>> {
        const txReceipt = await this.walletProvider.getChainProvider().getTransactionByHash(initTx);
        await this.verifyInitiateSwapTransaction(swapParams, txReceipt);

        const address = await this.walletProvider.getAddress();
        const refundMsg = [new MsgExecuteContract(address.toString(), txReceipt.to.toString(), { refund: {} })];
        return this.walletProvider.sendTransaction({ msgs: refundMsg, fee, feeAsset: swapParams.asset });
    }

    public async getSwapSecret(claimTxHash: string, _initTxHash?: string): Promise<string> {
        const claimTxReceipt = await this.walletProvider.getChainProvider().getTransactionByHash(claimTxHash);
        return claimTxReceipt.secret;
    }

    protected async doesTransactionMatchInitiation(swapParams: SwapParams, initTx: Transaction<TerraTxInfo>): Promise<boolean> {
        const network = await this.walletProvider.getConnectedNetwork();
        const txParams = initTx?._raw?.htlc;

        return (
            compare(network.codeId, txParams?.code_id) &&
            compare(swapParams.recipientAddress.toString(), txParams.buyer) &&
            compare(swapParams.refundAddress.toString(), txParams.seller) &&
            compare(swapParams.secretHash, txParams.secret_hash) &&
            Math.eq(swapParams.expiration, txParams.expiration) &&
            Math.eq(swapParams.value, initTx.value)
        );
    }

    public canUpdateFee(): boolean {
        return false;
    }

    public async updateTransactionFee(_tx: string | Transaction<TerraTxInfo>, _newFee: FeeType): Promise<Transaction<TerraTxInfo>> {
        throw new UnsupportedMethodError('Method not supported.');
    }

    public abstract findInitiateSwapTransaction(_swapParams: SwapParams, _blockNumber?: number): Promise<Transaction<TerraTxInfo>>;

    public abstract findClaimSwapTransaction(
        _swapParams: SwapParams,
        _initTxHash: string,
        _blockNumber?: number
    ): Promise<Transaction<TerraTxInfo>>;

    public abstract findRefundSwapTransaction(
        _swapParams: SwapParams,
        _initiationTxHash: string,
        _blockNumber?: number
    ): Promise<Transaction<TerraTxInfo>>;
}
