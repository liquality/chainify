import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { LedgerProviderTypes } from '@liquality/hw-ledger';

export type GetAppType = () => Promise<HwAppEthereum>;

export interface EvmLedgerCreateOptions extends LedgerProviderTypes.CreateOptions<HwAppEthereum> {
    derivationPath?: string;
}

export interface LedgerAddressType {
    publicKey: string;
    address: string;
    chainCode?: string;
}
