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
  sequence: number,
  coinbase?: string
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
  address: string,
  derivationPath?: string
}

export enum AddressType {
  LEGACY = 'legacy',
  P2SH_SEGWIT = 'p2sh-segwit',
  BECH32 = 'bech32'
}

export enum SwapMode {
  P2SH = 'p2sh',
  P2SH_SEGWIT = 'p2shSegwit',
  P2WSH = 'p2wsh'
}

export type AddressTxCounts = { [index: string]: number }

export interface PsbtInputTarget {
  index: number,
  derivationPath: string
}

export namespace rpc {
  export interface UTXO {
    txid: string,
    vout: number,
    address: string,
    label: string,
    scriptPubKey: string,
    amount: number,
    confirmations: number,
    redeemScript: string,
    witnessScript: string,
    spendable: boolean,
    solvable: boolean,
    desc: string,
    safe: boolean
  }

  export interface ReceivedByAddress {
    involvesWatchOnly: boolean,
    address: string,
    account: string,
    amount: number,
    cofirmations: number,
    label: string,
    txids: string[]
  }

  export interface MinedTransaction extends Transaction {
    blockhash: string,
    confirmations: number,
    blocktime: number,
    number: number
  }

  export interface FundRawResponse {
    hex: string,
    fee: number,
    changepos: number
  }

  export interface AddressInfo {
    iswatchonly: boolean,
    pubkey: string,
    hdkeypath: string
    // ...
  }

  export type AddressGrouping = string[][]

  export interface ReceivedByAddress {
    involvesWatchonly: boolean,
    address: string,
    account: string,
    amount: number,
    confirmations: number,
    label: string,
    txids: string[]
  }

  export interface Block {
    hash: string,
    confirmations: number,
    size: number,
    strippedSize: number,
    weight: number,
    height: number,
    version: number,
    versionHex: string,
    merkleroot: string,
    tx: string[],
    time: number,
    mediantime: number,
    nonce: number,
    bits: string,
    difficulty: number,
    chainwork: string,
    nTx: number,
    previousblockhash: string,
    nextblockhash?: string
  }
}