import { Chain } from '@chainify/client';
import { AddressType, Asset, BigNumber } from '@chainify/types';
import { BIP32Interface, fromSeed } from 'bip32';
import { mnemonicToSeed } from 'bip39';
import { ECPair, ECPairInterface, Psbt, script, Transaction as BitcoinJsTransaction } from 'bitcoinjs-lib';
import { signAsync as signBitcoinMessage } from 'bitcoinjs-message';
import { BitcoinBaseChainProvider } from '../chain/BitcoinBaseChainProvider';
import { AddressType as BitcoinAddressType, BitcoinHDWalletProviderOptions, Input, OutputTarget, PsbtInputTarget } from '../types';
import { BitcoinBaseWalletProvider } from './BitcoinBaseWallet';
import { IBitcoinWallet } from './IBitcoinWallet';

export class BitcoinHDWalletProvider extends BitcoinBaseWalletProvider implements IBitcoinWallet<BitcoinBaseChainProvider> {
    private _mnemonic: string;
    private _seedNode: BIP32Interface;
    private _baseDerivationNode: BIP32Interface;

    constructor(options: BitcoinHDWalletProviderOptions, chainProvider?: Chain<BitcoinBaseChainProvider>) {
        const { mnemonic, baseDerivationPath, addressType = BitcoinAddressType.BECH32, network } = options;
        super({ baseDerivationPath, addressType, network }, chainProvider);

        if (!mnemonic) {
            throw new Error('Mnemonic should not be empty');
        }
        this._mnemonic = mnemonic;
    }

    public canUpdateFee() {
        return true;
    }

    public async getSigner(): Promise<null> {
        return null;
    }

    public async getAddress(): Promise<AddressType> {
        const addresses = await this.getAddresses();
        return addresses[0];
    }

    public async getBalance(_assets: Asset[]): Promise<BigNumber[]> {
        const addresses = await this.getAddresses();
        return await this.chainProvider.getBalance(addresses, _assets);
    }

    public async signMessage(message: string, from: string) {
        const address = await this.getWalletAddress(from);
        const keyPair = await this.keyPair(address.derivationPath);
        const signature = await signBitcoinMessage(message, keyPair.privateKey, keyPair.compressed);
        return signature.toString('hex');
    }

    public async exportPrivateKey() {
        return this._toWIF(this._baseDerivationPath);
    }

    public async getConnectedNetwork() {
        return this._network;
    }

    public async isWalletAvailable() {
        return true;
    }

    protected async baseDerivationNode() {
        if (this._baseDerivationNode) {
            return this._baseDerivationNode;
        }
        const baseNode = await this.seedNode();
        this._baseDerivationNode = baseNode.derivePath(this._baseDerivationPath);
        return this._baseDerivationNode;
    }

    protected async buildTransaction(targets: OutputTarget[], feePerByte?: number, fixedInputs?: Input[]) {
        const network = this._network;

        const unusedAddress = await this.getUnusedAddress(true);
        const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs);

        if (change) {
            targets.push({
                address: unusedAddress.address,
                value: change.value,
            });
        }

        const psbt = new Psbt({ network });

        const needsWitness = [BitcoinAddressType.BECH32, BitcoinAddressType.P2SH_SEGWIT].includes(this._addressType);

        for (let i = 0; i < inputs.length; i++) {
            const wallet = await this.getWalletAddress(inputs[i].address);
            const keyPair = await this.keyPair(wallet.derivationPath);
            const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey);

            const psbtInput: any = {
                hash: inputs[i].txid,
                index: inputs[i].vout,
                sequence: 0,
            };

            if (needsWitness) {
                psbtInput.witnessUtxo = {
                    script: paymentVariant.output,
                    value: inputs[i].value,
                };
            } else {
                const inputTxRaw = await this.chainProvider.getProvider().getRawTransactionByHash(inputs[i].txid);
                psbtInput.nonWitnessUtxo = Buffer.from(inputTxRaw, 'hex');
            }

            if (this._addressType === BitcoinAddressType.P2SH_SEGWIT) {
                psbtInput.redeemScript = paymentVariant.redeem.output;
            }

            psbt.addInput(psbtInput);
        }

        for (const output of targets) {
            if (output.script) {
                psbt.addOutput({
                    value: output.value,
                    script: output.script,
                });
            } else {
                psbt.addOutput({
                    value: output.value,
                    address: output.address,
                });
            }
        }

        for (let i = 0; i < inputs.length; i++) {
            const wallet = await this.getWalletAddress(inputs[i].address);
            const keyPair = await this.keyPair(wallet.derivationPath);
            psbt.signInput(i, keyPair);
            psbt.validateSignaturesOfInput(i);
        }

        psbt.finalizeAllInputs();

        return { hex: psbt.extractTransaction().toHex(), fee };
    }

    protected async buildSweepTransaction(externalChangeAddress: string, feePerByte: number) {
        let _feePerByte = feePerByte || null; // TODO: fix me
        if (!_feePerByte) {
            _feePerByte = await this.chainProvider.getProvider().getFeePerByte();
        }

        const { inputs, outputs, change } = await this.getInputsForAmount([], _feePerByte, [], 100, true);

        if (change) {
            throw new Error('There should not be any change for sweeping transaction');
        }

        const _outputs = [{ address: externalChangeAddress, value: outputs[0].value }];

        // TODO: fix the inherited legacy code
        return this.buildTransaction(_outputs, feePerByte, inputs as unknown as Input[]);
    }

    public async signPSBT(data: string, inputs: PsbtInputTarget[]) {
        const psbt = Psbt.fromBase64(data, { network: this._network });
        for (const input of inputs) {
            const keyPair = await this.keyPair(input.derivationPath);
            psbt.signInput(input.index, keyPair);
        }
        return psbt.toBase64();
    }

    public async signBatchP2SHTransaction(
        inputs: [{ inputTxHex: string; index: number; vout: any; outputScript: Buffer; txInputIndex?: number }],
        addresses: string,
        tx: any,
        lockTime?: number,
        segwit?: boolean
    ) {
        const keyPairs = [];
        for (const address of addresses) {
            const wallet = await this.getWalletAddress(address);
            const keyPair = await this.keyPair(wallet.derivationPath);
            keyPairs.push(keyPair);
        }

        const sigs = [];
        for (let i = 0; i < inputs.length; i++) {
            const index = inputs[i].txInputIndex ? inputs[i].txInputIndex : inputs[i].index;
            let sigHash;
            if (segwit) {
                sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, BitcoinJsTransaction.SIGHASH_ALL);
            } else {
                sigHash = tx.hashForSignature(index, inputs[i].outputScript, BitcoinJsTransaction.SIGHASH_ALL);
            }

            const sig = script.signature.encode(keyPairs[i].sign(sigHash), BitcoinJsTransaction.SIGHASH_ALL);
            sigs.push(sig);
        }

        return sigs;
    }

    private async keyPair(derivationPath: string): Promise<ECPairInterface> {
        const wif = await this._toWIF(derivationPath);
        return ECPair.fromWIF(wif, this._network);
    }

    private async _toWIF(derivationPath: string): Promise<string> {
        const node = await this.seedNode();
        return node.derivePath(derivationPath).toWIF();
    }

    private async seedNode() {
        if (this._seedNode) {
            return this._seedNode;
        }

        const seed = await mnemonicToSeed(this._mnemonic);
        this._seedNode = fromSeed(seed, this._network);

        return this._seedNode;
    }
}
