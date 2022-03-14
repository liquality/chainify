import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import Eth from '@ledgerhq/hw-app-eth';
import { sleep } from '@liquality/utils';
import { ethers } from 'ethers';
import { GetAppType } from './types';

const defaultPath = "m/44'/60'/0'/0/0";

export class EvmLedgerSigner extends Signer {
    public provider: Provider;

    private readonly getApp: GetAppType;
    private readonly derivationPath: string;

    constructor(getApp: GetAppType, derivationPath?: string, provider?: Provider) {
        super();
        this.provider = provider;
        this.getApp = getApp;
        this.derivationPath = derivationPath || defaultPath;
    }

    async getAddress(): Promise<string> {
        const account = await this._retry((eth) => eth.getAddress(this.derivationPath));
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
        const sig = await this._retry((eth) => eth.signTransaction(this.derivationPath, unsignedTx));

        return ethers.utils.serializeTransaction(baseTx, {
            v: ethers.BigNumber.from('0x' + sig.v).toNumber(),
            r: '0x' + sig.r,
            s: '0x' + sig.s,
        });
    }

    public connect(provider: Provider): EvmLedgerSigner {
        return new EvmLedgerSigner(this.getApp, this.derivationPath, provider);
    }

    private async _retry<T = any>(callback: (eth: Eth) => Promise<T>, timeout?: number): Promise<T> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            if (timeout && timeout > 0) {
                setTimeout(() => {
                    reject(new Error('timeout'));
                }, timeout);
            }

            const eth = await this.getApp();

            // Wait up to 5 seconds
            for (let i = 0; i < 50; i++) {
                try {
                    const result = await callback(eth);
                    return resolve(result);
                } catch (error) {
                    if (error.id !== 'TransportLocked') {
                        return reject(error);
                    }
                }
                await sleep(100);
            }

            return reject(new Error('timeout'));
        });
    }
}
