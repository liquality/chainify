import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { Bytes, hexlify, joinSignature } from '@ethersproject/bytes';
import { resolveProperties } from '@ethersproject/properties';
import { toUtf8Bytes } from '@ethersproject/strings';
import { serialize, TransactionTypes, UnsignedTransaction } from '@ethersproject/transactions';
import Eth from '@ledgerhq/hw-app-eth';
import LedgerService from '@ledgerhq/hw-app-eth/lib/services/ledger';
import { LoadConfig, ResolutionConfig } from '@ledgerhq/hw-app-eth/lib/services/types';
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

    constructor(
        getApp: GetAppType,
        derivationPath?: string,
        provider?: Provider,
        addressCache?: {
            publicKey?: string;
            address: string;
        }
    ) {
        super();
        this.provider = provider;
        this.addressCache = {};
        this.getApp = getApp;
        this.derivationPath = derivationPath || defaultPath;
        if (addressCache) {
            const { publicKey, address } = addressCache;
            this.addressCache = {
                [this.derivationPath]: {
                    publicKey,
                    address,
                },
            };
        }
    }

    public async getAddress(): Promise<string> {
        if (this.addressCache[this.derivationPath]) {
            return getAddress(this.addressCache[this.derivationPath].address.toLowerCase());
        }
        const { address, publicKey } = await this._retry(async (eth) => await eth.getAddress(this.derivationPath));
        this.addressCache[this.derivationPath] = { address, publicKey };
        return getAddress(address?.toLowerCase());
    }

    public async signMessage(message: Bytes | string): Promise<string> {
        if (typeof message === 'string') {
            message = toUtf8Bytes(message);
        }

        const messageHex = hexlify(message).substring(2);

        const sig = await this._retry((eth) => eth.signPersonalMessage(this.derivationPath, messageHex));
        sig.r = '0x' + sig.r;
        sig.s = '0x' + sig.s;
        return joinSignature(sig);
    }

    public async signTransaction(transaction: TransactionRequest): Promise<string> {
        const tx = await resolveProperties(transaction);
        const baseTx: UnsignedTransaction = {
            chainId: tx.chainId || undefined,
            data: tx.data || undefined,
            gasLimit: tx.gasLimit || undefined,
            gasPrice: tx.gasPrice || undefined,
            nonce: tx.nonce ? BigNumber.from(tx.nonce).toNumber() : undefined,
            type: tx.type,
            to: tx.to || undefined,
            value: tx.value || undefined,
        };

        if (transaction.type === TransactionTypes.eip1559) {
            baseTx.maxFeePerGas = tx.maxFeePerGas;
            baseTx.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        }

        const unsignedTx = serialize(baseTx).substring(2);
        const resolution = await LedgerService.resolveTransaction(unsignedTx, loadConfig, resolutionConfig);
        const sig = await this._retry(async (eth) => await eth.signTransaction(this.derivationPath, unsignedTx, resolution));
        return serialize(baseTx, {
            v: BigNumber.from('0x' + sig.v).toNumber(),
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
