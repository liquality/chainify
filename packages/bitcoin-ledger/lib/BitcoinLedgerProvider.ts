import HwAppBitcoin from '@ledgerhq/hw-app-btc';
import { BitcoinBaseChainProvider, BitcoinBaseWalletProvider, BitcoinTypes, BitcoinUtils } from '@liquality/bitcoin';
import { Chain } from '@liquality/client';
import { UnimplementedMethodError } from '@liquality/errors';
import { LedgerProvider } from '@liquality/hw-ledger';
import { AddressType, Asset, BigNumber } from '@liquality/types';
import { padHexStart } from '@liquality/utils';
import { BIP32Interface, fromPublicKey } from 'bip32';
import { address, Psbt, PsbtTxInput, script, Transaction as BitcoinJsTransaction } from 'bitcoinjs-lib';
import { BitcoinLedgerProviderOptions } from './types';

export class BitcoinLedgerProvider extends BitcoinBaseWalletProvider {
    private _ledgerProvider: LedgerProvider<HwAppBitcoin>;
    private _walletPublicKeyCache: Record<string, any>;
    private _baseDerivationNode: BIP32Interface;

    constructor(options: BitcoinLedgerProviderOptions, chainProvider: Chain<BitcoinBaseChainProvider>) {
        super(options, chainProvider);
        const scrambleKey = options.ledgerScrambleKey || 'BTC';
        this._ledgerProvider = new LedgerProvider<HwAppBitcoin>({ ...options, App: HwAppBitcoin, ledgerScrambleKey: scrambleKey });
        this._walletPublicKeyCache = {};
    }

    public async signMessage(message: string, from: string) {
        const app = await this._ledgerProvider.getApp();
        const address = await this.getWalletAddress(from);
        const hex = Buffer.from(message).toString('hex');
        const sig = await app.signMessageNew(address.derivationPath, hex);
        return sig.r + sig.s;
    }

    public async getConnectedNetwork() {
        return this.chainProvider.getNetwork();
    }

    public async getSigner(): Promise<null> {
        return null;
    }

    public async getAddress(): Promise<AddressType> {
        const addresses = await this.getAddresses();
        return addresses[0];
    }

    public async getBalance(assets: Asset[]): Promise<BigNumber[]> {
        const addresses = await this.getAddresses();
        return this.chainProvider.getBalance(addresses, assets);
    }

    public async exportPrivateKey(): Promise<string> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return true;
    }

    public async signPSBT(data: string, inputs: BitcoinTypes.PsbtInputTarget[]) {
        const psbt = Psbt.fromBase64(data, { network: this._network });
        const app = await this._ledgerProvider.getApp();

        const inputsArePubkey = psbt.txInputs.every((input, index) =>
            ['witnesspubkeyhash', 'pubkeyhash', 'p2sh-witnesspubkeyhash'].includes(psbt.getInputType(index))
        );

        if (inputsArePubkey && psbt.txInputs.length !== inputs.length) {
            throw new Error('signPSBT: Ledger must sign all inputs when they are all regular pub key hash payments.');
        }

        if (inputsArePubkey) {
            const ledgerInputs = await this.getLedgerInputs(
                psbt.txInputs.map((input) => ({ txid: input.hash.reverse().toString('hex'), vout: input.index }))
            );

            const getInputDetails = async (input: PsbtTxInput) => {
                const txHex = await this.chainProvider.getProvider().getRawTransactionByHash(input.hash.reverse().toString('hex'));
                const tx = BitcoinUtils.decodeRawTransaction(txHex, this._network);
                const address = tx.vout[input.index].scriptPubKey.addresses[0];
                const walletAddress = await this.getWalletAddress(address);
                return walletAddress;
            };

            const inputDetails = await Promise.all(psbt.txInputs.map(getInputDetails));
            const paths = inputDetails.map((i) => i.derivationPath);
            const outputScriptHex = app
                .serializeTransactionOutputs({
                    outputs: psbt.txOutputs.map((output) => ({
                        script: output.script,
                        amount: this.getAmountBuffer(output.value),
                    })),
                    version: null,
                    inputs: null,
                })
                .toString('hex');
            const isSegwit = [BitcoinTypes.AddressType.BECH32, BitcoinTypes.AddressType.P2SH_SEGWIT].includes(this._addressType);
            const changeAddress = await this.findAddress(
                psbt.txOutputs.map((output) => output.address),
                true
            );

            const txHex = await app.createPaymentTransactionNew({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                inputs: ledgerInputs,
                associatedKeysets: paths,
                changePath: changeAddress && changeAddress.derivationPath,
                outputScriptHex,
                segwit: isSegwit,
                useTrustedInputForSegwit: isSegwit,
                additionals: this._addressType === 'bech32' ? ['bech32'] : [],
            });

            const signedTransaction = BitcoinJsTransaction.fromHex(txHex);

            psbt.setVersion(1); // Ledger payment txs use v1 and there is no option to change it - fuck knows why
            for (const input of inputs) {
                const signer = {
                    network: this._network,
                    publicKey: Buffer.from(inputDetails[input.index].publicKey, 'hex'),
                    sign: async () => {
                        const sigInput = signedTransaction.ins[input.index];
                        if (sigInput.witness.length) {
                            return script.signature.decode(sigInput.witness[0]).signature;
                        } else return sigInput.script;
                    },
                };

                await psbt.signInputAsync(input.index, signer);
            }

            return psbt.toBase64();
        }

        const ledgerInputs = [];
        const walletAddresses = [];
        let isSegwit = false;

        for (const input of inputs) {
            const walletAddress = await this.getDerivationPathAddress(input.derivationPath);
            walletAddresses.push(walletAddress);
            const { witnessScript, redeemScript } = psbt.data.inputs[input.index];
            const { hash: inputHash, index: inputIndex } = psbt.txInputs[input.index];
            const outputScript = witnessScript || redeemScript;
            const inputTxHex = await this.chainProvider.getProvider().getRawTransactionByHash(inputHash.reverse().toString('hex'));
            const ledgerInputTx = app.splitTransaction(inputTxHex, true);
            ledgerInputs.push([ledgerInputTx, inputIndex, outputScript.toString('hex'), 0]);
            if (witnessScript) isSegwit = true;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - accessing private method required
        const ledgerTx = app.splitTransaction(psbt.__CACHE.__TX.toHex(), true);
        const ledgerOutputs = app.serializeTransactionOutputs(ledgerTx);

        const ledgerSigs = await app.signP2SHTransaction({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            inputs: ledgerInputs,
            associatedKeysets: walletAddresses.map((address) => address.derivationPath),
            outputScriptHex: ledgerOutputs.toString('hex'),
            lockTime: psbt.locktime,
            segwit: isSegwit,
            transactionVersion: 2,
        });

        for (const input of inputs) {
            const signer = {
                network: this._network,
                publicKey: Buffer.from(walletAddresses[input.index].publicKey, 'hex'),
                sign: async () => {
                    const finalSig = isSegwit ? ledgerSigs[input.index] : ledgerSigs[input.index] + '01'; // Is this a ledger bug? Why non segwit signs need the sighash appended?
                    const { signature } = script.signature.decode(Buffer.from(finalSig, 'hex'));
                    return signature;
                },
            };

            await psbt.signInputAsync(input.index, signer);
        }

        return psbt.toBase64();
    }

    public async signBatchP2SHTransaction(
        inputs: [{ inputTxHex: string; index: number; vout: any; outputScript: Buffer }],
        addresses: string,
        tx: any,
        lockTime?: number,
        segwit?: boolean
    ): Promise<Buffer[]> {
        const app = await this._ledgerProvider.getApp();

        const walletAddressDerivationPaths = [];
        for (const address of addresses) {
            const walletAddress = await this.getWalletAddress(address);
            walletAddressDerivationPaths.push(walletAddress.derivationPath);
        }

        if (!segwit) {
            for (const input of inputs) {
                tx.setInputScript(input.vout.n, input.outputScript);
            }
        }

        const ledgerTx = await app.splitTransaction(tx.toHex(), true);
        const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex');

        const ledgerInputs = [];
        for (const input of inputs) {
            const ledgerInputTx = await app.splitTransaction(input.inputTxHex, true);
            ledgerInputs.push([ledgerInputTx, input.index, input.outputScript.toString('hex'), 0]);
        }

        const ledgerSigs = await app.signP2SHTransaction({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            inputs: ledgerInputs,
            associatedKeysets: walletAddressDerivationPaths,
            outputScriptHex: ledgerOutputs,
            lockTime,
            segwit,
            transactionVersion: 2,
        });

        const finalLedgerSigs = [];
        for (const ledgerSig of ledgerSigs) {
            const finalSig = segwit ? ledgerSig : ledgerSig + '01';
            finalLedgerSigs.push(Buffer.from(finalSig, 'hex'));
        }

        return finalLedgerSigs;
    }

    protected buildSweepTransaction(_externalChangeAddress: string, _feePerByte?: number): Promise<{ hex: string; fee: number }> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    protected async baseDerivationNode() {
        if (this._baseDerivationNode) {
            return this._baseDerivationNode;
        }
        const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath);
        const compressedPubKey = BitcoinUtils.compressPubKey(walletPubKey.publicKey);
        this._baseDerivationNode = fromPublicKey(
            Buffer.from(compressedPubKey, 'hex'),
            Buffer.from(walletPubKey.chainCode, 'hex'),
            this._network
        );
        return this._baseDerivationNode;
    }

    protected async buildTransaction(
        targets: BitcoinTypes.OutputTarget[],
        feePerByte?: number,
        fixedInputs?: BitcoinTypes.Input[]
    ): Promise<{ hex: string; fee: number }> {
        const app = await this._ledgerProvider.getApp();

        const unusedAddress = await this.getUnusedAddress(true);
        const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs);
        const ledgerInputs = await this.getLedgerInputs(inputs);
        const paths = inputs.map((utxo) => utxo.derivationPath);

        const outputs = targets.map((output) => {
            const outputScript = output.script || address.toOutputScript(output.address, this._network);
            return { amount: this.getAmountBuffer(output.value), script: outputScript };
        });

        if (change) {
            outputs.push({
                amount: this.getAmountBuffer(change.value),
                script: address.toOutputScript(unusedAddress.address, this._network),
            });
        }

        const outputScriptHex = app
            .serializeTransactionOutputs({
                outputs,
                version: null,
                inputs: null,
            })
            .toString('hex');

        const isSegwit = [BitcoinTypes.AddressType.BECH32, BitcoinTypes.AddressType.P2SH_SEGWIT].includes(this._addressType);

        const txHex = await app.createPaymentTransactionNew({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            inputs: ledgerInputs,
            associatedKeysets: paths,
            changePath: unusedAddress.derivationPath,
            outputScriptHex,
            segwit: isSegwit,
            useTrustedInputForSegwit: isSegwit,
            additionals: this._addressType === BitcoinTypes.AddressType.BECH32 ? ['bech32'] : [],
        });

        return { hex: txHex, fee };
    }

    private getAmountBuffer(amount: number) {
        let hexAmount = new BigNumber(Math.round(amount)).toString(16);
        hexAmount = padHexStart(hexAmount, 8);
        const valueBuffer = Buffer.from(hexAmount, 'hex');
        return valueBuffer.reverse();
    }

    private async getLedgerInputs(unspentOutputs: { txid: string; vout: number }[]) {
        const app = await this._ledgerProvider.getApp();

        return Promise.all(
            unspentOutputs.map(async (utxo) => {
                const hex = await this.chainProvider.getProvider().getTransactionHex(utxo.txid);
                const tx = app.splitTransaction(hex, true);
                return [tx, utxo.vout, undefined, 0];
            })
        );
    }

    private async getWalletPublicKey(path: string) {
        if (path in this._walletPublicKeyCache) {
            return this._walletPublicKeyCache[path];
        }

        const walletPublicKey = await this._getWalletPublicKey(path);
        this._walletPublicKeyCache[path] = walletPublicKey;
        return walletPublicKey;
    }

    private async _getWalletPublicKey(path: string) {
        const app = await this._ledgerProvider.getApp();
        const format = this._addressType === BitcoinTypes.AddressType.P2SH_SEGWIT ? 'p2sh' : this._addressType;
        return app.getWalletPublicKey(path, { format });
    }
}
