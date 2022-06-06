import { LedgerProviderTypes } from '@chainify/hw-ledger';
import { Address } from '@chainify/types';
import HwAppEthereum from '@ledgerhq/hw-app-eth';

export type GetAppType = () => Promise<HwAppEthereum>;

export interface EvmLedgerCreateOptions extends LedgerProviderTypes.CreateOptions {
    derivationPath?: string;
    addressCache?: Address
}

export interface LedgerAddressType {
    publicKey: string;
    address: string;
    chainCode?: string;
}
