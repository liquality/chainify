import { StaticJsonRpcProvider } from '@ethersproject/providers';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { Chain } from '@liquality/client';
import { UnimplementedMethodError } from '@liquality/errors';
import { EvmBaseWalletProvider } from '@liquality/evm';
import { LedgerProvider } from '@liquality/hw-ledger';
import { Address, Network } from '@liquality/types';
import { ethers } from 'ethers';
import HDKey from 'hdkey';
import { EvmLedgerSigner } from './EvmLedgerSigner';
import { EvmLedgerCreateOptions, LedgerAddressType } from './types';
const defaultPath = "m/44'/60'/0'/0/0";

export class EvmLedgerProvider extends EvmBaseWalletProvider<StaticJsonRpcProvider, EvmLedgerSigner> {
    private _ledgerProvider: LedgerProvider<HwAppEthereum>;
    private _walletOptions: EvmLedgerCreateOptions;
    private _derivationPath: string;
    private _ledgerSigner: EvmLedgerSigner;
    private _hdKey: HDKey;
    private _rootPubKeysCache: Record<string, LedgerAddressType>;

    constructor(walletOptions: EvmLedgerCreateOptions, chainProvider?: Chain<StaticJsonRpcProvider>) {
        super(chainProvider);

        this._ledgerProvider = new LedgerProvider<HwAppEthereum>({ ...walletOptions, App: HwAppEthereum });
        this._walletOptions = walletOptions;
        this._derivationPath = walletOptions.derivationPath ? walletOptions.derivationPath + walletOptions.index : defaultPath;
        this._ledgerSigner = new EvmLedgerSigner(this._ledgerProvider.getApp.bind(this._ledgerProvider), this._derivationPath);
        this._hdKey = new HDKey();
        this._rootPubKeysCache = {};

        if (chainProvider) {
            this._ledgerSigner = this._ledgerSigner.connect(chainProvider.getProvider());
        }

        this.signer = this._ledgerSigner;
    }

    public async setWalletIndex(index: number): Promise<Address> {
        const newDerivationPath = this._walletOptions.derivationPath + index;
        this.signer.setDerivationPath(newDerivationPath);
        const app = await this._ledgerProvider.getApp();
        const account = await app.getAddress(newDerivationPath, true, true);
        return new Address({
            address: account.address,
            derivationPath: newDerivationPath,
            publicKey: account.publicKey,
        });
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

    public async getAddresses(start = 0, numAddresses = 1): Promise<Address[]> {
        let rootPub = null;

        if (this._rootPubKeysCache[this._walletOptions.derivationPath]) {
            rootPub = this._rootPubKeysCache[this._walletOptions.derivationPath];
        } else {
            const app = await this._ledgerProvider.getApp();
            rootPub = await app.getAddress(this._walletOptions.derivationPath, false, true);
            this._rootPubKeysCache[this._walletOptions.derivationPath] = rootPub;
        }

        this._hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
        this._hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');

        const addresses: Address[] = [];
        for (let i = start; i < numAddresses; i++) {
            const derivedKey = this._hdKey.derive('m/' + i);
            const address = ethers.utils.computeAddress(derivedKey.publicKey);
            addresses.push(
                new Address({
                    address: address,
                    derivationPath: this._walletOptions.derivationPath + i,
                    publicKey: derivedKey.publicKey.toString(),
                })
            );
        }

        return addresses;
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
