export interface OutputTarget {
  address: string,
  value: number
}

export interface ScriptPubKey {
  asm: string,
  hex: string,
  reqSigs: number,
  type: string,
  addresses: string[]
}

export interface Output {
  value: number,
  n: number,
  scriptPubKey: ScriptPubKey
}

export interface Input {
  txid: string,
  vout: number,
  scriptSig: {
    asm: string,
    hex: string
  },
  txinwitness: string[],
  sequence: number
}

export interface Transaction {
  txid: string,
  hash: string,
  version: number,
  locktime: number,
  size: number,
  vsize: number,
  weight: number,
  vin: Input[],
  vout: Output[],
  confirmations?: number,
  hex: string
}

export interface UTXO {
  txid: string,
  vout: number,
  value: number,
  address: string
}

export enum AddressTypes {
  LEGACY = 'legacy',
  P2SH_SEGWIT = 'p2sh-segwit',
  BECH32 = 'bech32'
}