import { BitcoinTypes } from '@chainify/bitcoin';
import { LedgerProviderTypes } from '@chainify/hw-ledger';

export interface BitcoinLedgerProviderOptions extends LedgerProviderTypes.CreateOptions {
    baseDerivationPath: string;
    basePublicKey?: string;
    baseChainCode?: string;
    addressType: BitcoinTypes.AddressType;
    network: BitcoinTypes.BitcoinNetwork;

}
