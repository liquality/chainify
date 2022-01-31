import { Chain } from '@liquality/client';
import { AddressType, WalletOptions } from '@liquality/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
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
        return this._wallet.address;
    }

    public async getUnusedAddress(_change: boolean, _numAddressPerCall: number): Promise<AddressType> {
        return this._wallet.address;
    }

    public async getUsedAddresses(numAddresses?: number): Promise<AddressType[]> {
        return this.getAddresses(0, numAddresses, false);
    }

    public async getAddresses(start: number, numAddresses: number, _change: boolean): Promise<AddressType[]> {
        const result: AddressType[] = [];
        for (let i = start; i < start + numAddresses; i++) {
            result.push(EthersWallet.fromMnemonic(this._walletOptions.mnemonic, this._walletOptions.derivationPath + i).address);
        }
        return result;
    }

    public async exportPrivateKey(): Promise<string> {
        return this._wallet.privateKey;
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return true;
    }
}
