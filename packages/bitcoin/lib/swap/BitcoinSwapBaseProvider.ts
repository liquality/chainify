import { Swap } from '@chainify/client';
import { Address, BigNumber, SwapParams, Transaction } from '@chainify/types';
import { validateExpiration, validateSecret, validateSecretAndHash, validateSecretHash, validateValue } from '@chainify/utils';
import { payments, Psbt, script as bScript } from 'bitcoinjs-lib';
import { BitcoinBaseChainProvider } from '../chain/BitcoinBaseChainProvider';
import { BitcoinNetwork, Input, SwapMode, Transaction as BitcoinTransaction } from '../types';
import {
    calculateFee,
    decodeRawTransaction,
    getPubKeyHash,
    normalizeTransactionObject,
    validateAddress,
    witnessStackToScriptWitness,
} from '../utils';
import { IBitcoinWallet } from '../wallet/IBitcoinWallet';
import { BitcoinSwapProviderOptions, TransactionMatchesFunction } from './types';

export abstract class BitcoinSwapBaseProvider extends Swap<BitcoinBaseChainProvider, null, IBitcoinWallet<BitcoinBaseChainProvider>> {
    protected _network: BitcoinNetwork;
    protected _mode: SwapMode;

    constructor(options: BitcoinSwapProviderOptions, walletProvider?: IBitcoinWallet<BitcoinBaseChainProvider>) {
        super(walletProvider);
        const { network, mode = SwapMode.P2WSH } = options;
        const swapModes = Object.values(SwapMode);
        if (!swapModes.includes(mode)) {
            throw new Error(`Mode must be one of ${swapModes.join(',')}`);
        }
        this._network = network;
        this._mode = mode;
    }

    public validateSwapParams(swapParams: SwapParams) {
        validateValue(swapParams.value);
        validateAddress(swapParams.recipientAddress, this._network);
        validateAddress(swapParams.refundAddress, this._network);
        validateSecretHash(swapParams.secretHash);
        validateExpiration(swapParams.expiration);
    }

    public async initiateSwap(swapParams: SwapParams, feePerByte: number) {
        this.validateSwapParams(swapParams);

        const swapOutput = this.getSwapOutput(swapParams);
        const address = this.getSwapPaymentVariants(swapOutput)[this._mode].address;
        return this.walletProvider.sendTransaction({
            to: address,
            value: swapParams.value,
            fee: feePerByte,
        });
    }

    public async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, feePerByte: number) {
        this.validateSwapParams(swapParams);
        validateSecret(secret);
        validateSecretAndHash(secret, swapParams.secretHash);
        await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash);
        return this._redeemSwap(swapParams, initiationTxHash, true, secret, feePerByte);
    }

    public async refundSwap(swapParams: SwapParams, initiationTxHash: string, feePerByte: number) {
        this.validateSwapParams(swapParams);
        await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash);
        return this._redeemSwap(swapParams, initiationTxHash, false, undefined, feePerByte);
    }

    public findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction<any>> {
        this.validateSwapParams(swapParams);
        return this.findSwapTransaction(swapParams, blockNumber, (tx: Transaction<BitcoinTransaction>) =>
            this.doesTransactionMatchInitiation(swapParams, tx)
        );
    }

    public async getSwapSecret(claimTxHash: string, initTxHash: string): Promise<string> {
        const claimSwapTransaction: Transaction<BitcoinTransaction> = await this.walletProvider
            .getChainProvider()
            .getTransactionByHash(claimTxHash);

        if (claimSwapTransaction) {
            const swapInput = claimSwapTransaction._raw.vin.find((vin) => vin.txid === initTxHash);
            if (!swapInput) {
                throw new Error('Claim input missing');
            }
            const inputScript = this.getInputScript(swapInput);
            const secret = inputScript[2] as string;
            return secret;
        }
    }

    public async findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string, blockNumber?: number): Promise<Transaction<any>> {
        this.validateSwapParams(swapParams);

        const claimSwapTransaction: Transaction<BitcoinTransaction> = await this.findSwapTransaction(
            swapParams,
            blockNumber,
            (tx: Transaction<BitcoinTransaction>) => this.doesTransactionMatchRedeem(initTxHash, tx, false)
        );

        if (claimSwapTransaction) {
            const swapInput = claimSwapTransaction._raw.vin.find((vin) => vin.txid === initTxHash);
            if (!swapInput) {
                throw new Error('Claim input missing');
            }
            const inputScript = this.getInputScript(swapInput);
            const secret = inputScript[2] as string;
            validateSecretAndHash(secret, swapParams.secretHash);
            return { ...claimSwapTransaction, secret, _raw: claimSwapTransaction };
        }
    }

    public async findRefundSwapTransaction(
        swapParams: SwapParams,
        initiationTxHash: string,
        blockNumber?: number
    ): Promise<Transaction<any>> {
        this.validateSwapParams(swapParams);

        const refundSwapTransaction = await this.findSwapTransaction(swapParams, blockNumber, (tx: Transaction<BitcoinTransaction>) =>
            this.doesTransactionMatchRedeem(initiationTxHash, tx, true)
        );
        return refundSwapTransaction;
    }

    protected onWalletProviderUpdate(_wallet: IBitcoinWallet<BitcoinBaseChainProvider, any>): void {
        // do nothing
    }

    protected getSwapOutput(swapParams: SwapParams) {
        this.validateSwapParams(swapParams);

        const secretHashBuff = Buffer.from(swapParams.secretHash, 'hex');
        const recipientPubKeyHash = getPubKeyHash(swapParams.recipientAddress.toString(), this._network);
        const refundPubKeyHash = getPubKeyHash(swapParams.refundAddress.toString(), this._network);
        const OPS = bScript.OPS;

        const script = bScript.compile([
            OPS.OP_IF,
            OPS.OP_SIZE,
            bScript.number.encode(32),
            OPS.OP_EQUALVERIFY,
            OPS.OP_SHA256,
            secretHashBuff,
            OPS.OP_EQUALVERIFY,
            OPS.OP_DUP,
            OPS.OP_HASH160,
            recipientPubKeyHash,
            OPS.OP_ELSE,
            bScript.number.encode(swapParams.expiration),
            OPS.OP_CHECKLOCKTIMEVERIFY,
            OPS.OP_DROP,
            OPS.OP_DUP,
            OPS.OP_HASH160,
            refundPubKeyHash,
            OPS.OP_ENDIF,
            OPS.OP_EQUALVERIFY,
            OPS.OP_CHECKSIG,
        ]);

        if (![97, 98].includes(Buffer.byteLength(script))) {
            throw new Error('Invalid swap script');
        }

        return script;
    }

    private getSwapInput(sig: Buffer, pubKey: Buffer, isClaim: boolean, secret?: string) {
        const OPS = bScript.OPS;
        const redeem = isClaim ? OPS.OP_TRUE : OPS.OP_FALSE;
        const secretParams = isClaim ? [Buffer.from(secret, 'hex')] : [];
        return bScript.compile([sig, pubKey, ...secretParams, redeem]);
    }

    protected getSwapPaymentVariants(swapOutput: Buffer) {
        const p2wsh = payments.p2wsh({
            redeem: { output: swapOutput, network: this._network },
            network: this._network,
        });
        const p2shSegwit = payments.p2sh({
            redeem: p2wsh,
            network: this._network,
        });
        const p2sh = payments.p2sh({
            redeem: { output: swapOutput, network: this._network },
            network: this._network,
        });

        return {
            [SwapMode.P2WSH]: p2wsh,
            [SwapMode.P2SH_SEGWIT]: p2shSegwit,
            [SwapMode.P2SH]: p2sh,
        };
    }

    private async _redeemSwap(swapParams: SwapParams, initiationTxHash: string, isClaim: boolean, secret: string, feePerByte: number) {
        const address = isClaim ? swapParams.recipientAddress : swapParams.refundAddress;
        const swapOutput = this.getSwapOutput(swapParams);
        return this._redeemSwapOutput(
            initiationTxHash,
            swapParams.value,
            address.toString(),
            swapOutput,
            swapParams.expiration,
            isClaim,
            secret,
            feePerByte
        );
    }

    private async _redeemSwapOutput(
        initiationTxHash: string,
        value: BigNumber,
        address: string,
        swapOutput: Buffer,
        expiration: number,
        isClaim: boolean,
        secret: string,
        _feePerByte: number
    ) {
        const network = this._network;
        const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput);

        const initiationTxRaw = await this.walletProvider.getChainProvider().getProvider().getRawTransactionByHash(initiationTxHash);
        const initiationTx = decodeRawTransaction(initiationTxRaw, this._network);

        let swapVout;
        let paymentVariantName: string;
        let paymentVariant: payments.Payment;
        for (const vout of initiationTx.vout) {
            const paymentVariantEntry = Object.entries(swapPaymentVariants).find(
                ([, payment]) => payment.output.toString('hex') === vout.scriptPubKey.hex
            );
            const voutValue = new BigNumber(vout.value).times(1e8);
            if (paymentVariantEntry && voutValue.eq(new BigNumber(value))) {
                paymentVariantName = paymentVariantEntry[0];
                paymentVariant = paymentVariantEntry[1];
                swapVout = vout;
            }
        }

        if (!swapVout) {
            throw new Error('Valid swap output not found');
        }

        const feePerByte = _feePerByte || (await this.walletProvider.getChainProvider().getProvider().getFeePerByte());

        // TODO: Implement proper fee calculation that counts bytes in inputs and outputs
        const txfee = calculateFee(1, 1, feePerByte);
        const swapValue = new BigNumber(swapVout.value).times(1e8).toNumber();

        if (swapValue - txfee < 0) {
            throw new Error('Transaction amount does not cover fee.');
        }

        const psbt = new Psbt({ network });

        if (!isClaim) {
            psbt.setLocktime(expiration);
        }

        const isSegwit = paymentVariantName === SwapMode.P2WSH || paymentVariantName === SwapMode.P2SH_SEGWIT;

        const input: any = {
            hash: initiationTxHash,
            index: swapVout.n,
            sequence: 0,
        };

        if (isSegwit) {
            input.witnessUtxo = {
                script: paymentVariant.output,
                value: swapValue,
            };
            input.witnessScript = swapPaymentVariants.p2wsh.redeem.output; // Strip the push bytes (0020) off the script
        } else {
            input.nonWitnessUtxo = Buffer.from(initiationTxRaw, 'hex');
            input.redeemScript = paymentVariant.redeem.output;
        }

        const output = {
            address: address,
            value: swapValue - txfee,
        };

        psbt.addInput(input);
        psbt.addOutput(output);

        const walletAddress: Address = await this.walletProvider.getWalletAddress(address);
        const signedPSBTHex: string = await this.walletProvider.signPSBT(psbt.toBase64(), [
            { index: 0, derivationPath: walletAddress.derivationPath },
        ]);
        const signedPSBT = Psbt.fromBase64(signedPSBTHex, { network });

        const sig = signedPSBT.data.inputs[0].partialSig[0].signature;

        const swapInput = this.getSwapInput(sig, Buffer.from(walletAddress.publicKey, 'hex'), isClaim, secret);
        const paymentParams = { redeem: { output: swapOutput, input: swapInput, network }, network };
        const paymentWithInput = isSegwit ? payments.p2wsh(paymentParams) : payments.p2sh(paymentParams);

        const getFinalScripts = () => {
            let finalScriptSig;
            let finalScriptWitness;

            // create witness stack
            if (isSegwit) {
                finalScriptWitness = witnessStackToScriptWitness(paymentWithInput.witness);
            }

            if (paymentVariantName === SwapMode.P2SH_SEGWIT) {
                // Adds the necessary push OP (PUSH34 (00 + witness script hash))
                const inputScript = bScript.compile([swapPaymentVariants.p2shSegwit.redeem.output]);
                finalScriptSig = inputScript;
            } else if (paymentVariantName === SwapMode.P2SH) {
                finalScriptSig = paymentWithInput.input;
            }

            return {
                finalScriptSig,
                finalScriptWitness,
            };
        };

        psbt.finalizeInput(0, getFinalScripts);

        const hex = psbt.extractTransaction().toHex();
        await this.walletProvider.getChainProvider().sendRawTransaction(hex);
        return normalizeTransactionObject(decodeRawTransaction(hex, this._network), txfee);
    }

    protected extractSwapParams(outputScript: string) {
        const buffer = bScript.decompile(Buffer.from(outputScript, 'hex')) as Buffer[];
        if (buffer.length !== 20) {
            throw new Error('Invalid swap output script');
        }
        const secretHash = buffer[5].reverse().toString('hex');
        const recipientPublicKey = buffer[9].reverse().toString('hex');
        const expiration = parseInt(buffer[11].reverse().toString('hex'), 16);
        const refundPublicKey = buffer[16].reverse().toString('hex');
        return { recipientPublicKey, refundPublicKey, secretHash, expiration };
    }

    /**
     * Only to be used for situations where transaction is trusted. e.g to bump fee
     * DO NOT USE THIS TO VERIFY THE REDEEM
     */
    private async UNSAFE_isSwapRedeemTransaction(transaction: Transaction<BitcoinTransaction>) {
        // eslint-disable-line
        if (transaction._raw.vin.length === 1 && transaction._raw.vout.length === 1) {
            const swapInput = transaction._raw.vin[0];
            const inputScript = this.getInputScript(swapInput);
            const initiationTransaction: Transaction<BitcoinTransaction> = await this.walletProvider
                .getChainProvider()
                .getTransactionByHash(transaction._raw.vin[0].txid);
            const scriptType = initiationTransaction._raw.vout[transaction._raw.vin[0].vout].scriptPubKey.type;
            if (['scripthash', 'witness_v0_scripthash'].includes(scriptType) && [4, 5].includes(inputScript.length)) return true;
        }
        return false;
    }

    public canUpdateFee(): boolean {
        return true;
    }

    public async updateTransactionFee(tx: Transaction<BitcoinTransaction> | string, newFeePerByte: number) {
        const txHash = typeof tx === 'string' ? tx : tx.hash;
        const transaction: Transaction<BitcoinTransaction> = await this.walletProvider.getChainProvider().getTransactionByHash(txHash);
        if (await this.UNSAFE_isSwapRedeemTransaction(transaction)) {
            const swapInput = transaction._raw.vin[0];
            const inputScript = this.getInputScript(swapInput);
            const initiationTxHash = swapInput.txid;
            const initiationTx: Transaction<BitcoinTransaction> = await this.walletProvider
                .getChainProvider()
                .getTransactionByHash(initiationTxHash);
            const swapOutput = initiationTx._raw.vout[swapInput.vout];
            const value = new BigNumber(swapOutput.value).times(1e8);
            const address = transaction._raw.vout[0].scriptPubKey.addresses[0];
            const isClaim = inputScript.length === 5;
            const secret = isClaim ? inputScript[2] : undefined;
            const outputScript = isClaim ? inputScript[4] : inputScript[3];
            const { expiration } = this.extractSwapParams(outputScript);
            return this._redeemSwapOutput(
                initiationTxHash,
                value,
                address,
                Buffer.from(outputScript, 'hex'),
                expiration,
                isClaim,
                secret,
                newFeePerByte
            );
        }
        return this.walletProvider.updateTransactionFee(tx, newFeePerByte);
    }

    protected getInputScript(vin: Input) {
        const inputScript = vin.txinwitness
            ? vin.txinwitness
            : bScript.decompile(Buffer.from(vin.scriptSig.hex, 'hex')).map((b) => (Buffer.isBuffer(b) ? b.toString('hex') : b));
        return inputScript as string[];
    }

    protected doesTransactionMatchRedeem(initiationTxHash: string, tx: Transaction<BitcoinTransaction>, isRefund: boolean) {
        const swapInput = tx._raw.vin.find((vin) => vin.txid === initiationTxHash);
        if (!swapInput) return false;
        const inputScript = this.getInputScript(swapInput);
        if (!inputScript) return false;
        if (isRefund) {
            if (inputScript.length !== 4) return false;
        } else {
            if (inputScript.length !== 5) return false;
        }
        return true;
    }

    protected doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<BitcoinTransaction>) {
        const swapOutput = this.getSwapOutput(swapParams);
        const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput);
        const vout = transaction._raw.vout.find((vout) =>
            Object.values(swapPaymentVariants).find(
                (payment) =>
                    payment.output.toString('hex') === vout.scriptPubKey.hex &&
                    new BigNumber(vout.value).times(1e8).eq(new BigNumber(swapParams.value))
            )
        );
        return Boolean(vout);
    }

    protected abstract findSwapTransaction(
        swapParams: SwapParams,
        blockNumber: number,
        predicate: TransactionMatchesFunction
    ): Promise<Transaction<BitcoinTransaction>>;
}
