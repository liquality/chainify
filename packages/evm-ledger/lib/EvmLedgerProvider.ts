import { StaticJsonRpcProvider } from '@ethersproject/providers';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { Chain } from '@liquality/client';
import { UnimplementedMethodError } from '@liquality/errors';
import { EvmBaseWalletProvider } from '@liquality/evm';
import { LedgerProvider } from '@liquality/hw-ledger';
import { Address, Network } from '@liquality/types';
import { EvmLedgerSigner } from './EvmLedgerSigner';
import { EvmLedgerCreateOptions } from './types';

const defaultPath = "m/44'/60'/0'/0/0";

export class EvmLedgerProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EvmLedgerSigner> {
    private _ledgerSigner: EvmLedgerSigner;
    private _ledgerProvider: LedgerProvider<HwAppEthereum>;
    private _derivationPath: string;

    constructor(walletOptions: EvmLedgerCreateOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);
        this._ledgerProvider = new LedgerProvider<HwAppEthereum>({ ...walletOptions, App: HwAppEthereum });
        this._derivationPath = walletOptions.derivationPath || defaultPath;
        this._ledgerSigner = new EvmLedgerSigner(this._ledgerProvider.getApp.bind(this._ledgerProvider), this._derivationPath);

        if (chainProvider) {
            this._ledgerSigner = this._ledgerSigner.connect(chainProvider.getProvider());
        }

        this.signer = this._ledgerSigner;
    }

    public async getAddress(): Promise<Address> {
        const addresses = await this.getAddresses();
        return addresses[0];
    }

    public async getUnusedAddress(): Promise<Address> {
        return this.getAddress();
    }

    public async getUsedAddresses(): Promise<Address[]> {
        return this.getAddresses();
    }

    public async getAddresses(): Promise<Address[]> {
        const app = await this._ledgerProvider.getApp();
        const address = await app.getAddress(this._derivationPath);
        return [
            new Address({
                address: address.address,
                derivationPath: this._derivationPath,
                publicKey: address.publicKey,
            }),
        ];
    }

    public async exportPrivateKey(): Promise<string> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public async getConnectedNetwork(): Promise<Network> {
        return this._ledgerProvider.getConnectedNetwork();
    }

    public canUpdateFee(): boolean {
        return true;
    }
}
