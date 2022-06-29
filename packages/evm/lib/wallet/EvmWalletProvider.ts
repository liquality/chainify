import { Chain } from '@chainify/client';
import { Address, NamingProvider, Network, WalletOptions } from '@chainify/types';
import { compare, remove0x } from '@chainify/utils';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { SignTypedMessageType } from '../types';
import { EvmBaseWalletProvider } from './EvmBaseWalletProvider';

export class EvmWalletProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EthersWallet> {
    private _wallet: EthersWallet;
    private _walletOptions: WalletOptions;

    constructor(walletOptions: WalletOptions, chainProvider?: Chain<StaticJsonRpcProvider>, namingProvider?: NamingProvider) {
        super(chainProvider, namingProvider);
        this._walletOptions = walletOptions;
        this._wallet = EthersWallet.fromMnemonic(walletOptions.mnemonic, walletOptions.derivationPath);

        if (chainProvider) {
            this._wallet = this._wallet.connect(chainProvider.getProvider());
        }

        this.signer = this._wallet;
    }

    public async getAddress(): Promise<Address> {
        const name = this.getNamingProvider() ? await this.getNamingProvider().lookupAddress(this._wallet.address) : null;

        return new Address({
            address: this._wallet.address,
            derivationPath: this._walletOptions.derivationPath,
            publicKey: this._wallet.publicKey,
            name,
        });
    }

    public async signTypedData({ data, from, version }: SignTypedMessageType): Promise<string> {
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
        return this.getAddress();
    }

    public async getUsedAddresses(): Promise<Address[]> {
        return this.getAddresses();
    }

    public async getAddresses(): Promise<Address[]> {
        const address = await this.getAddress();
        return [address];
    }

    public async exportPrivateKey(): Promise<string> {
        return remove0x(this._wallet.privateKey);
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return true;
    }

    protected onChainProviderUpdate(chainProvider: Chain<StaticJsonRpcProvider, Network>): void {
        this._wallet = this._wallet.connect(chainProvider.getProvider());
    }
}
