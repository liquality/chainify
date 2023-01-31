import { Address, Network } from '@chainify/types';
import HwAppBitcoin from '@ledgerhq/hw-app-btc';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';

export interface CreateOptions {
    transportCreator: TransportCreator;
    createLedgerApp: CreateLedgerApp;
    network: Network;
    scrambleKey?: string;
}

export type Newable<T> = { new(...args: any[]): T };

export type GetAddressesFuncType = (start?: number, numAddresses?: number, change?: boolean) => Promise<Address[]>;

export interface TransportCreator {
    create: (onDisconnect?: () => void) => Promise<Transport>;
}

export type CreateLedgerApp = (transport: Transport, scrambleKey: string, network: Network) => HwAppBitcoin | HwAppEthereum;