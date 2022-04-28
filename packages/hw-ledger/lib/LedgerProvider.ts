import { WalletError } from '@chainify/errors';
import { Address, Network } from '@chainify/types';
import { compare } from '@chainify/utils';
import Transport from '@ledgerhq/hw-transport';
import { CreateOptions, GetAddressesFuncType, IApp, TransportCreator } from './types';

export class LedgerProvider<TApp extends IApp> {
    private _App: any;
    private _Transport: TransportCreator;

    private _network: Network;
    private _ledgerScrambleKey: string;

    protected _transport: Transport;
    protected _appInstance: TApp;

    constructor(options: CreateOptions<TApp>) {
        this._App = options.App;
        this._Transport = options.Transport;

        this._network = options.network;
        // The ledger scramble key is required to be set on the ledger transport
        // if communicating with the device using `transport.send` for the first time
        this._ledgerScrambleKey = options.ledgerScrambleKey;
    }

    public async isWalletAvailable() {
        const app = await this.getApp();
        if (!app.transport.scrambleKey) {
            // scramble key required before calls
            app.transport.setScrambleKey(this._ledgerScrambleKey);
        }
        const exchangeTimeout = app.transport.exchangeTimeout;
        app.transport.setExchangeTimeout(2000);
        try {
            // https://ledgerhq.github.io/btchip-doc/bitcoin-technical-beta.html#_get_random
            await this._transport.send(0xe0, 0xc0, 0x00, 0x00);
        } catch (e) {
            return false;
        } finally {
            app.transport.setExchangeTimeout(exchangeTimeout);
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

    public async getApp() {
        try {
            await this.createTransport();
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { name, ...errorNoName } = e;
            throw new WalletError(e.toString(), errorNoName);
        }
        if (!this._appInstance) {
            this._appInstance = new Proxy(new this._App(this._transport), { get: this.errorProxy.bind(this) });
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
            this._transport = await this._Transport.create();

            this._transport.on('disconnect', () => {
                this._appInstance = null;
                this._transport = null;
            });
        }
    }
}
