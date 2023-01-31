import { BitcoinTypes } from '@chainify/bitcoin';
import { CreateOptions } from '@chainify/hw-ledger';

export interface BitcoinLedgerProviderOptions extends CreateOptions {
    baseDerivationPath: string;
    basePublicKey?: string;
    baseChainCode?: string;
    addressType: BitcoinTypes.AddressType;
    network: BitcoinTypes.BitcoinNetwork;
}
