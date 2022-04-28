import { Network } from '@chainify/types';
import { Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib';

export * as BitcoinEsploraTypes from './chain/esplora/types';
export * as BitcoinJsonRpcTypes from './chain/jsonRpc/types';
export * from './swap/types';

export interface BitcoinNetwork extends Network, BitcoinJsLibNetwork {}

export interface BitcoinNodeWalletOptions {
    addressType?: AddressType;
    network?: BitcoinNetwork;
}
export interface BitcoinWalletProviderOptions extends BitcoinNodeWalletOptions {
    baseDerivationPath: string;
}

export interface BitcoinHDWalletProviderOptions extends BitcoinWalletProviderOptions {
    mnemonic: string;
}

export interface OutputTarget {
    address?: string;
    script?: Buffer;
    value: number;
}

export interface ScriptPubKey {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
}

export interface Output {
    value: number;
    n: number;
    scriptPubKey: ScriptPubKey;
}

export interface Input {
    txid: string;
    vout: number;
    scriptSig: {
        asm: string;
        hex: string;
    };
    txinwitness: string[];
    sequence: number;
    coinbase?: string;
}

export interface Transaction {
    txid: string;
    hash: string;
    version: number;
    locktime: number;
    size: number;
    vsize: number;
    weight: number;
    vin: Input[];
    vout: Output[];
    confirmations?: number;
    hex: string;
}

export interface UTXO {
    txid: string;
    vout: number;
    value: number;
    address: string;
    derivationPath?: string;
}

export enum AddressType {
    LEGACY = 'legacy',
    P2SH_SEGWIT = 'p2sh-segwit',
    BECH32 = 'bech32',
}

export enum SwapMode {
    P2SH = 'p2sh',
    P2SH_SEGWIT = 'p2shSegwit',
    P2WSH = 'p2wsh',
}

export type AddressTxCounts = { [index: string]: number };

export interface PsbtInputTarget {
    index: number;
    derivationPath: string;
}

export interface P2SHInput {
    inputTxHex: string;
    index: number;
    vout: any;
    outputScript: Buffer;
}
