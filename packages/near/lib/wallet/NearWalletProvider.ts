import { Chain, HttpClient, Wallet } from '@chainify/client';
import { UnsupportedMethodError } from '@chainify/errors';
import { Address, AddressType, Asset, BigNumber, Transaction } from '@chainify/types';
import {
    BN,
    InMemorySigner,
    KeyPair,
    keyStores,
    NearAccount,
    NearNetwork,
    NearTxLog,
    NearTxRequest,
    NearTxResponse,
    NearWallet,
    NearWalletOptions,
    parseSeedPhrase,
    providers,
} from '../types';
import { parseTxResponse } from '../utils';

export class NearWalletProvider extends Wallet<providers.JsonRpcProvider, InMemorySigner> {
    private _derivationPath: string;
    private _wallet: NearWallet;
    private _keyStore: keyStores.InMemoryKeyStore;
    private _addressCache: { [key: string]: Address };
    private _helper: HttpClient;

    constructor(walletOptions: NearWalletOptions, chainProvider?: Chain<providers.JsonRpcProvider>) {
        super(chainProvider);
        this._derivationPath = walletOptions.derivationPath;
        this._wallet = parseSeedPhrase(walletOptions.mnemonic, this._derivationPath);
        this._keyStore = new keyStores.InMemoryKeyStore();
        this._addressCache = {};
        this._helper = new HttpClient({ baseURL: walletOptions.helperUrl });
    }

    public getSigner(): InMemorySigner {
        return new InMemorySigner(this._keyStore);
    }

    public async getAddress(): Promise<Address> {
        if (this._addressCache[this._derivationPath]) {
            return this._addressCache[this._derivationPath];
        }

        const { publicKey, secretKey } = this._wallet;
        const keyPair = KeyPair.fromString(secretKey);

        let address = await this.getImplicitAccount(publicKey, 0);

        if (!address) {
            address = Buffer.from(keyPair.getPublicKey().data).toString('hex');
        }

        await this._keyStore.setKey(this.chainProvider.getNetwork().networkId.toString(), address, keyPair);

        const result = new Address({ address, derivationPath: this._derivationPath, publicKey });

        this._wallet.address = result;
        this._addressCache[this._derivationPath] = result;
        return result;
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
        const to = txRequest.to.toString();

        let tx = null;
        if (!txRequest.actions) {
            tx = (await from.sendMoney(to, new BN(txRequest.value.toFixed(0)))) as NearTxResponse;
        } else {
            tx = (await from.signAndSendTransaction({ receiverId: to, actions: txRequest.actions })) as NearTxResponse;
        }

        return parseTxResponse(tx);
    }

    public async sendBatchTransaction(txRequests: NearTxRequest[]): Promise<Transaction<NearTxLog>[]> {
        const result: Transaction<NearTxLog>[] = [];
        for (const txRequest of txRequests) {
            const tx = await this.sendTransaction(txRequest);
            result.push(tx);
        }
        return result;
    }

    public async sendSweepTransaction(to: AddressType, _asset: Asset): Promise<Transaction<NearTxLog>> {
        const address = await this.getAddress();
        const from = this.getAccount(address.toString());
        const tx = (await from.deleteAccount(to.toString())) as NearTxResponse;
        return parseTxResponse(tx);
    }

    public async getBalance(_assets: Asset[]): Promise<BigNumber[]> {
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

    public async updateTransactionFee(_tx: string | Transaction<any>): Promise<Transaction<NearTxResponse>> {
        throw new UnsupportedMethodError('Method not supported for Near');
    }

    public async getConnectedNetwork(): Promise<NearNetwork> {
        return this.chainProvider.getNetwork() as NearNetwork;
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

    protected onChainProviderUpdate(_chainProvider: Chain<providers.JsonRpcProvider, NearNetwork>): void {
        // do nothing
    }

    private async getImplicitAccount(publicKey: string, index: number) {
        const accounts = await this._helper.nodeGet(`/publicKey/${publicKey.toString()}/accounts`);
        return accounts[index];
    }
}
