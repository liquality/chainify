import { BitcoinTypes } from '@chainify/bitcoin';
import { LedgerProviderTypes } from '@chainify/hw-ledger';
import HwAppBitcoin from '@ledgerhq/hw-app-btc';

export interface BitcoinLedgerProviderOptions extends LedgerProviderTypes.CreateOptions<HwAppBitcoin> {
    baseDerivationPath: string;
    addressType: BitcoinTypes.AddressType;
    network: BitcoinTypes.BitcoinNetwork;
}
