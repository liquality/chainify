import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { Chain } from '@liquality/client';
import { Address, AddressType, BigNumberish, WalletOptions } from '@liquality/types';

import { remove0x } from './utils';
import { EvmBaseWalletProvider } from './EvmBaseWalletProvider';

export class EvmWalletProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider> {
    private _wallet: EthersWallet;
    private _walletOptions: WalletOptions;

    constructor(walletOptions: WalletOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);
        this._walletOptions = walletOptions;
        this._wallet = EthersWallet.fromMnemonic(walletOptions.mnemonic, walletOptions.derivationPath + walletOptions.index);

        if (chainProvider) {
            this._wallet = this._wallet.connect(chainProvider.getProvider());
        }

        this.signer = this._wallet;
    }

    public async getAddress(): Promise<AddressType> {
        return new Address({
            address: this._wallet.address,
            derivationPath: this._walletOptions.derivationPath + this._walletOptions.index,
            publicKey: this._wallet.publicKey,
        });
    }

    public async setWalletIndex(index: BigNumberish): Promise<AddressType> {
        this._wallet = EthersWallet.fromMnemonic(this._walletOptions.mnemonic, this._walletOptions.derivationPath + index);
        return this.getAddress();
    }

    public async getUnusedAddress(): Promise<AddressType> {
        return this._wallet.address;
    }

    public async getUsedAddresses(numAddresses: number = 1): Promise<AddressType[]> {
        return this.getAddresses(0, numAddresses, false);
    }

    public async getAddresses(start: number = 0, numAddresses: number = 1, _change: boolean = false): Promise<AddressType[]> {
        const result: AddressType[] = [];
        for (let i = start; i < start + numAddresses; i++) {
            const tempWallet = EthersWallet.fromMnemonic(this._walletOptions.mnemonic, this._walletOptions.derivationPath + i);
            result.push(
                new Address({
                    publicKey: tempWallet.publicKey,
                    address: tempWallet.address,
                    derivationPath: this._walletOptions.derivationPath + i,
                })
            );
        }
        return result;
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
