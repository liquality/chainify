import { Address, Network } from '@chainify/types';
import Transport from '@ledgerhq/hw-transport';

export interface CreateOptions<TApp> {
    App: Newable<TApp>;
    Transport: any;
    network: Network;
    ledgerScrambleKey: string;
}

export interface IApp {
    transport: any;
}

export type Newable<T> = { new (...args: any[]): T };

export type TransportCreator = {
    create: () => Promise<Transport>;
};

export type GetAddressesFuncType = (start?: number, numAddresses?: number, change?: boolean) => Promise<Address[]>;
