import { Chain } from '@chainify/client';
import { UnimplementedMethodError } from '@chainify/errors';
import { EvmBaseWalletProvider } from '@chainify/evm';
import { LedgerProvider } from '@chainify/hw-ledger';
import { Address, Network } from '@chainify/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { ethers } from 'ethers';
import { EvmLedgerSigner } from './EvmLedgerSigner';
import { EvmLedgerCreateOptions } from './types';

const defaultPath = "m/44'/60'/0'/0/0";

export class EvmLedgerProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EvmLedgerSigner> {
    private _ledgerSigner: EvmLedgerSigner;
    private _ledgerProvider: LedgerProvider<HwAppEthereum>;
    private _derivationPath: string;
    private _addressCache: Record<string, Address>;

    constructor(options: EvmLedgerCreateOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);

        this._ledgerProvider = new LedgerProvider<HwAppEthereum>(HwAppEthereum, {
            ...options,
            scrambleKey: options.scrambleKey || 'w0w',
        });

        this._derivationPath = options.derivationPath || defaultPath;
        this._addressCache = {};
        if (options.addressCache) {
            const { publicKey, address } = options.addressCache;
            this._addressCache = {
                [options.derivationPath]: {
                    publicKey,
                    address
                },
            };
        }
        this._ledgerSigner = new EvmLedgerSigner(this._ledgerProvider.getApp.bind(this._ledgerProvider), this._derivationPath, null, options.addressCache);

        if (chainProvider) {
            this._ledgerSigner = this._ledgerSigner.connect(chainProvider.getProvider());
        }

        this.signer = this._ledgerSigner;
    }

    protected onChainProviderUpdate(chainProvider: Chain<StaticJsonRpcProvider, Network>): void {
        this._ledgerSigner = this._ledgerSigner.connect(chainProvider.getProvider());
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
        if (this._addressCache[this._derivationPath]) {
            const { address, publicKey } = this._addressCache[this._derivationPath];
            return [new Address({
                address,
                derivationPath: this._derivationPath,
                publicKey
            })];
        }

        const ledgerAddress = await this.getLedgerAddress();
        const { address, publicKey } = ledgerAddress
        const _address = ethers.utils.getAddress(address.toLowerCase());
        this._addressCache[this._derivationPath] = { publicKey, address: _address };
        return [
            new Address({
                address: _address,
                derivationPath: this._derivationPath,
                publicKey
            }),
        ];
    }

    public async getLedgerAddress(): Promise<{
        publicKey: string;
        address: string;
        chainCode?: string;
    }> {
        const app = await this._ledgerProvider.getApp();
        return await app.getAddress(this._derivationPath);
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
