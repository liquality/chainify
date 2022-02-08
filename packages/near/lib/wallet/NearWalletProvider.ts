import { Chain, Wallet } from '@liquality/client';
import { Address, AddressType, Asset, BigNumberish, FeeData, Transaction, WalletOptions } from '@liquality/types';

import { parseTxResponse } from '../utils';
import {
    BN,
    keyStores,
    providers,
    parseSeedPhrase,
    InMemorySigner,
    KeyPair,
    NearWallet,
    NearTxRequest,
    NearAccount,
    NearTxResponse,
    NearTxLog,
} from '../types';

export class NearWalletProvider extends Wallet<providers.JsonRpcProvider, InMemorySigner> {
    private _wallet: NearWallet;
    private _walletOptions: WalletOptions;
    private _derivationPath: string;

    private _keyStore: keyStores.InMemoryKeyStore;
    private _addressCache: { [key: string]: Address };

    constructor(walletOptions: WalletOptions, chainProvider: Chain<providers.JsonRpcProvider>) {
        super(chainProvider);
        this._walletOptions = walletOptions;
        this._derivationPath = `${walletOptions.derivationPath}${walletOptions.index}'`;
        this._wallet = parseSeedPhrase(walletOptions.mnemonic, this._derivationPath);
        this._keyStore = new keyStores.InMemoryKeyStore();
        this._addressCache = {};
    }

    public getSigner(): InMemorySigner {
        return new InMemorySigner(this._keyStore);
    }

    public async getAddress(): Promise<AddressType> {
        if (this._addressCache[this._derivationPath]) {
            return this._addressCache[this._derivationPath];
        }

        const { publicKey, secretKey } = this._wallet;
        const keyPair = KeyPair.fromString(secretKey);

        // TODO: check if implicit accounts exist for that public key
        let address = null;
        // let address = await this.getMethod('getImplicitAccount')(publicKey, 0);

        if (!address) {
            address = Buffer.from(keyPair.getPublicKey().data).toString('hex');
        }

        await this._keyStore.setKey(this.chainProvider.getNetwork().networkId.toString(), address, keyPair);

        const result = new Address({ address, derivationPath: this._derivationPath, publicKey });

        this._wallet.address = result;
        this._addressCache[this._derivationPath] = result;
        return result;
    }

    public async getUnusedAddress(): Promise<AddressType> {
        if (this._wallet.address) {
            return this._wallet.address;
        } else {
            return this.getAddress();
        }
    }

    public async getUsedAddresses(numAddresses: number = 1): Promise<AddressType[]> {
        return this.getAddresses(0, numAddresses);
    }

    public async getAddresses(start: number = 0, numAddresses: number = 1): Promise<AddressType[]> {
        const result: AddressType[] = [];
        for (let i = start; i < start + numAddresses; i++) {
            const derivationPath = `${this._walletOptions.derivationPath}${i}'`;
            const tempWallet: NearWallet = parseSeedPhrase(this._walletOptions.mnemonic, derivationPath);

            if (this._addressCache[derivationPath]) {
                result.push(this._addressCache[derivationPath]);
            } else {
                const { publicKey, secretKey } = tempWallet;
                const keyPair = KeyPair.fromString(secretKey);

                let address = null;

                if (!address) {
                    address = Buffer.from(keyPair.getPublicKey().data).toString('hex');
                }

                result.push(new Address({ publicKey: publicKey, address: address, derivationPath: derivationPath }));
            }
        }
        return result;
    }

    public async signMessage(message: string): Promise<string> {
        const address = await this.getAddress();

        const signed = await this.getSigner().signMessage(
            Buffer.from(message),
            address.toString(),
            this.chainProvider.getNetwork().networkId.toString()
        );

        return Buffer.from(signed.signature).toString('hex');
    }

    public async sendTransaction(txRequest: NearTxRequest): Promise<Transaction<NearTxLog>> {
        const address = await this.getAddress();
        const from = this.getAccount(address.toString());

        // sending Near
        if (!txRequest.actions) {
            const tx = (await from.sendMoney(txRequest.to.toString(), new BN(txRequest.value.toString()))) as NearTxResponse;
            return parseTxResponse(tx);
        } else {
            const tx = (await from.signAndSendTransaction({
                receiverId: txRequest.to.toString(),
                actions: txRequest.actions as any,
            })) as NearTxResponse;

            return parseTxResponse(tx);
        }
    }

    public async sendBatchTransaction(txRequests: NearTxRequest[]): Promise<Transaction<NearTxLog>[]> {
        const result: Transaction<NearTxLog>[] = [];
        for (const txRequest of txRequests) {
            const tx = await this.sendTransaction(txRequest);
            result.push(tx);
        }
        return result;
    }

    public async sendSweepTransaction(to: AddressType, _asset: Asset, _fee?: FeeData): Promise<Transaction<NearTxLog>> {
        const address = await this.getAddress();
        const from = this.getAccount(address.toString());
        const tx = (await from.deleteAccount(to.toString())) as NearTxResponse;
        return parseTxResponse(tx);
    }

    public async getBalance(_assets: Asset[]): Promise<BigNumberish[]> {
        const user = await this.getAddress();
        return await this.chainProvider.getBalance([user], _assets);
    }

    public async exportPrivateKey(): Promise<string> {
        return this._wallet.secretKey;
    }

    public async isWalletAvailable(): Promise<boolean> {
        return Boolean(this.getAddress());
    }

    public canUpdateFee(): boolean {
        return false;
    }

    public async updateTransactionFee(_tx: string | Transaction<any>, _newFee: FeeData): Promise<Transaction<NearTxResponse>> {
        throw new Error('Method not supported for Near');
    }

    private getAccount(accountId: string): NearAccount {
        return new NearAccount(
            {
                networkId: this.chainProvider.getNetwork().networkId.toString(),
                provider: this.chainProvider.getProvider(),
                signer: this.getSigner(),
            },
            accountId
        );
    }
}
