import { WalletError } from '@chainify/errors';
import { Logger } from '@chainify/logger';
import { Address, Network } from '@chainify/types';
import { compare } from '@chainify/utils';
import Transport from '@ledgerhq/hw-transport';
import HwAppBitcoin from '@ledgerhq/hw-app-btc';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { CreateLedgerApp, CreateOptions, GetAddressesFuncType, TransportCreator } from './types';

const logger = new Logger('LedgerProvider');
export class LedgerProvider<T extends HwAppBitcoin | HwAppEthereum> {
    private _transportCreator: TransportCreator;
    private _createLedgerApp: CreateLedgerApp;


    private _network: Network;
    private _scrambleKey: string;

    protected _transport: Transport;
    protected _appInstance: T;

    constructor(options: CreateOptions) {
        this._transportCreator = options.transportCreator;
        this._createLedgerApp = options.createLedgerApp;
        this._network = options.network;
        // The ledger scramble key is required to be set on the ledger transport
        // if communicating with the device using `transport.send` for the first time
        this._scrambleKey = options.scrambleKey;
    }

    public async isWalletAvailable() {
        await this.getApp();
        // keep current exchange timeout
        const prevExchangeTimeout = this._transport.exchangeTimeout;
        // set exchange timeout to 2 seconds
        this._transport.setExchangeTimeout(2000);
        try {
            // https://ledgerhq.github.io/btchip-doc/bitcoin-technical-beta.html#_get_random
            await this._transport.send(0xe0, 0xc0, 0x00, 0x00);
        } catch (e) {
            logger.debug('isWalletAvailable.error', e);
            logger.debug('isWalletAvailable.error.message', e.message);
            return false;
        } finally {
            // set exchange timeout to previous value
            this._transport.setExchangeTimeout(prevExchangeTimeout);
        }
        return true;
    }

    public async getConnectedNetwork() {
        // Ledger apps do not provide connected network. It is separated in firmware.
        return this._network;
    }

    public async getWalletAddress(address: string, getAddresses: GetAddressesFuncType): Promise<Address> {
        let index = 0;
        let change = false;

        // A maximum number of addresses to lookup after which it is deemed
        // that the wallet does not contain this address
        const maxAddresses = 5000;
        const addressesPerCall = 50;

        while (index < maxAddresses) {
            const addrs = await getAddresses(index, addressesPerCall, change);
            const addr = addrs.find((addr) => compare(addr.toString(), address));
            if (addr) {
                return addr;
            }

            index += addressesPerCall;
            if (index === maxAddresses && change === false) {
                index = 0;
                change = true;
            }
        }

        throw new Error('Ledger: Wallet does not contain address');
    }

    public async getApp(): Promise<T> {
        try {
            await this.createTransport();
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { name, ...errorNoName } = e;
            throw new WalletError(e.toString(), errorNoName);
        }
        if (!this._appInstance) {
            const app = this._createLedgerApp(this._transport, this._scrambleKey, this._network) as T;
            this._appInstance = new Proxy(app, { get: this.errorProxy.bind(this) });
        }
        return this._appInstance;
    }

    protected errorProxy(target: any, func: string) {
        const method = target[func];
        if (Object.getOwnPropertyNames(target).includes(func) && typeof method === 'function') {
            return async (...args: any[]) => {
                try {
                    const result = await method.bind(target)(...args);
                    return result;
                } catch (e) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { name, ...errorNoName } = e;
                    this._transport = null;
                    this._appInstance = null;
                    throw new WalletError(e.toString(), errorNoName);
                }
            };
        } else {
            return method;
        }
    }

    private async createTransport() {
        if (!this._transport) {
            this._transport = await this._transportCreator.create(() => {
                this._appInstance = null;
                this._transport = null;
            });
        }
    }
}
