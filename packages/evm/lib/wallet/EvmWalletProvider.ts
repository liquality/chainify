import { Chain } from '@chainify/client';
import { Address, WalletOptions } from '@chainify/types';
import { remove0x } from '@chainify/utils';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { EvmBaseWalletProvider } from './EvmBaseWalletProvider';

export class EvmWalletProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EthersWallet> {
    private _wallet: EthersWallet;
    private _walletOptions: WalletOptions;

    constructor(walletOptions: WalletOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);
        this._walletOptions = walletOptions;
        this._wallet = EthersWallet.fromMnemonic(walletOptions.mnemonic, walletOptions.derivationPath);

        if (chainProvider) {
            this._wallet = this._wallet.connect(chainProvider.getProvider());
        }

        this.signer = this._wallet;
    }

    public async getAddress(): Promise<Address> {
        return new Address({
            address: this._wallet.address,
            derivationPath: this._walletOptions.derivationPath,
            publicKey: this._wallet.publicKey,
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
}
