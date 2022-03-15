import HwAppEthereum from '@ledgerhq/hw-app-eth';
import { LedgerProviderTypes } from '@liquality/hw-ledger';

export type GetAppType = () => Promise<HwAppEthereum>;

export interface EvmLedgerCreateOptions extends LedgerProviderTypes.CreateOptions<HwAppEthereum> {
    baseDerivationPath?: string;
}
