import HwAppBitcoin from '@ledgerhq/hw-app-btc';
import { BitcoinTypes } from '@liquality/bitcoin';
import { LedgerProviderTypes } from '@liquality/hw-ledger';

export interface BitcoinLedgerProviderOptions extends LedgerProviderTypes.CreateOptions<HwAppBitcoin> {
    baseDerivationPath: string;
    addressType: BitcoinTypes.AddressType;
}
