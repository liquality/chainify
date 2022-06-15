import { Chain } from '@chainify/client';
import { Address, Network, WalletOptions } from '@chainify/types';
import { compare, remove0x } from '@chainify/utils';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { SignTypedMessageType } from '../types';
import { EvmBaseWalletProvider } from './EvmBaseWalletProvider';
import { FastEthersWallet } from './FastEthersWallet';

export class EvmWalletProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EthersWallet> {
    private _wallet: EthersWallet;
    private _walletOptions: WalletOptions;

    constructor(walletOptions: WalletOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);
        this._walletOptions = walletOptions;
        this._wallet = null;
    }

    public async getSigner() {
        await this.initWallet();
        return this.signer;
    }

    public async getAddress(): Promise<Address> {
        await this.initWallet();
        return new Address({
            address: this._wallet.address,
            derivationPath: this._walletOptions.derivationPath,
            publicKey: this._wallet.publicKey,
        });
    }

    public async signTypedData({ data, from, version }: SignTypedMessageType): Promise<string> {
        await this.initWallet();

        if (!data) {
            throw new Error(`Undefined data - message required to sign typed data.`);
        }

        if (!from) {
            throw new Error(`Undefined address - from address required to sign typed data.`);
        }

        if (!compare(from, this.signer.address)) {
            throw new Error(`Non-matching address - from address does not match the signer`);
        }

        return signTypedData({
            privateKey: Buffer.from(remove0x(this.signer.privateKey), 'hex'),
            data,
            version: version || SignTypedDataVersion.V1,
        });
    }

    public async getUnusedAddress(): Promise<Address> {
        await this.initWallet();
        return this.getAddress();
    }

    public async getUsedAddresses(): Promise<Address[]> {
        await this.initWallet();
        return this.getAddresses();
    }

    public async getAddresses(): Promise<Address[]> {
        await this.initWallet();
        const address = await this.getAddress();
        return [address];
    }

    public async exportPrivateKey(): Promise<string> {
        await this.initWallet();
        return remove0x(this._wallet.privateKey);
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return true;
    }

    protected async onChainProviderUpdate(chainProvider: Chain<StaticJsonRpcProvider, Network>): Promise<void> {
        if (this._wallet) {
            this._wallet = this._wallet.connect(chainProvider.getProvider());
        }
    }

    private async initWallet(): Promise<void> {
        if (!this._wallet) {
            this._wallet = await FastEthersWallet.fromMnemonicAsync(this._walletOptions.mnemonic, this._walletOptions.derivationPath);

            if (this.chainProvider) {
                this._wallet = this._wallet.connect(this.chainProvider.getProvider());
            }

            this.signer = this._wallet;
        }
    }
}
