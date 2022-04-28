import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import Eth from '@ledgerhq/hw-app-eth';
import LedgerService from '@ledgerhq/hw-app-eth/lib/services/ledger';
import { LoadConfig, ResolutionConfig } from '@ledgerhq/hw-app-eth/lib/services/types';
import { ethers } from 'ethers';
import { GetAppType, LedgerAddressType } from './types';

const defaultPath = "m/44'/60'/0'/0/0";

const loadConfig: LoadConfig = {
    nftExplorerBaseURL: null,
    // example of payload https://cdn.live.ledger.com/plugins/ethereum/1.json
    // fetch against an api (base url is an api that hosts /plugins/ethereum/${chainId}.json )
    // set to null will disable it
    pluginBaseURL: null,
    // provide manually some extra plugins to add for the resolution (e.g. for dev purpose)
    // object will be merged with the returned value of the Ledger cdn payload
    extraPlugins: null,
};

const resolutionConfig: ResolutionConfig = {
    // NFT resolution service
    nft: false,
    // external plugins resolution service (e.G. LIDO)
    externalPlugins: false,
    // ERC20 resolution service (to clear sign erc20 transfers & other actions)
    erc20: false,
};

export class EvmLedgerSigner extends Signer {
    public provider: Provider;

    private addressCache: Record<string, LedgerAddressType>;
    private readonly getApp: GetAppType;
    private readonly derivationPath: string;

    constructor(getApp: GetAppType, derivationPath?: string, provider?: Provider) {
        super();
        this.provider = provider;
        this.addressCache = {};
        this.getApp = getApp;
        this.derivationPath = derivationPath || defaultPath;
    }

    public async getAddress(): Promise<string> {
        if (this.addressCache[this.derivationPath]) {
            return ethers.utils.getAddress(this.addressCache[this.derivationPath].address);
        }
        const account = await this._retry(async (eth) => await eth.getAddress(this.derivationPath));
        this.addressCache[this.derivationPath] = account;
        return ethers.utils.getAddress(account.address);
    }

    public async signMessage(message: ethers.utils.Bytes | string): Promise<string> {
        if (typeof message === 'string') {
            message = ethers.utils.toUtf8Bytes(message);
        }

        const messageHex = ethers.utils.hexlify(message).substring(2);

        const sig = await this._retry((eth) => eth.signPersonalMessage(this.derivationPath, messageHex));
        sig.r = '0x' + sig.r;
        sig.s = '0x' + sig.s;
        return ethers.utils.joinSignature(sig);
    }

    public async signTransaction(transaction: ethers.providers.TransactionRequest): Promise<string> {
        const tx = await ethers.utils.resolveProperties(transaction);
        const baseTx: ethers.utils.UnsignedTransaction = {
            chainId: tx.chainId || undefined,
            data: tx.data || undefined,
            gasLimit: tx.gasLimit || undefined,
            gasPrice: tx.gasPrice || undefined,
            nonce: tx.nonce ? ethers.BigNumber.from(tx.nonce).toNumber() : undefined,
            maxFeePerGas: tx.maxFeePerGas || undefined,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas || undefined,
            type: tx.type,
            to: tx.to || undefined,
            value: tx.value || undefined,
        };

        const unsignedTx = ethers.utils.serializeTransaction(baseTx).substring(2);
        const resolution = await LedgerService.resolveTransaction(unsignedTx, loadConfig, resolutionConfig);
        const sig = await this._retry(async (eth) => await eth.signTransaction(this.derivationPath, unsignedTx, resolution));
        return ethers.utils.serializeTransaction(baseTx, {
            v: ethers.BigNumber.from('0x' + sig.v).toNumber(),
            r: '0x' + sig.r,
            s: '0x' + sig.s,
        });
    }

    public connect(provider: Provider): EvmLedgerSigner {
        return new EvmLedgerSigner(this.getApp, this.derivationPath, provider);
    }

    private async _retry<T = any>(callback: (eth: Eth) => Promise<T>): Promise<T> {
        const eth = await this.getApp();
        try {
            return await callback(eth);
        } catch (error) {
            if (error.id !== 'TransportLocked') {
                throw Error(error);
            }
        }
    }
}
