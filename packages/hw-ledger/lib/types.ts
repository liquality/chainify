import { Address, Network } from '@chainify/types';
import Transport from '@ledgerhq/hw-transport';
import HwAppBitcoin from '@ledgerhq/hw-app-btc';
import HwAppEthereum from "@ledgerhq/hw-app-eth";

export interface CreateOptions<TApp extends HWApp> {
    appType: Newable<TApp>;
    transportCreator: TransportCreator;
    network: Network;
    ledgerScrambleKey: string;
}

export type HWApp = HwAppBitcoin | HwAppEthereum;
export type Newable<T> = { new(...args: any[]): T };

export type GetAddressesFuncType = (start?: number, numAddresses?: number, change?: boolean) => Promise<Address[]>;

export interface TransportCreator {
    create: (onDisconnect?: () => void) => Promise<Transport>;
}
