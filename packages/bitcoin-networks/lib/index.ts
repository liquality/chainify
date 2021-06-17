import { networks, Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib'
import { Network } from '@liquality/types'

// Used for non-reusable peculiarities
export enum ProtocolType {
  Bitcoin,
  BitcoinCash
}

export interface BitcoinNetwork extends Network, BitcoinJsLibNetwork {
  protocolType: ProtocolType
  segwitCapable: boolean
  feeBumpCapable: boolean
  // True for all cryptocurrencies except which use different Sighash such as
  // BTG BCH BCHSV BCHABC
  useBitcoinJSSign: boolean
}

const bitcoin: BitcoinNetwork = {
  name: 'bitcoin',
  protocolType: ProtocolType.Bitcoin,
  feeBumpCapable: true,
  segwitCapable: true,
  useBitcoinJSSign: true,
  ...networks.bitcoin,
  coinType: '0',
  isTestnet: false
}

const bitcoin_testnet: BitcoinNetwork = {
  name: 'bitcoin_testnet',
  protocolType: ProtocolType.Bitcoin,
  feeBumpCapable: true,
  segwitCapable: true,
  useBitcoinJSSign: true,
  ...networks.testnet,
  coinType: '1',
  isTestnet: true
}

const bitcoin_regtest: BitcoinNetwork = {
  name: 'bitcoin_regtest',
  protocolType: ProtocolType.Bitcoin,
  feeBumpCapable: true,
  segwitCapable: true,
  useBitcoinJSSign: true,
  ...networks.regtest,
  coinType: '1',
  isTestnet: true
}

const BitcoinNetworks = {
  bitcoin,
  bitcoin_testnet,
  bitcoin_regtest
}

export interface BitcoinCashNetwork extends BitcoinNetwork {
  prefix: string
}

const bitcoin_cash: BitcoinCashNetwork = {
  name: 'bitcoin_cash',
  protocolType: ProtocolType.BitcoinCash,
  prefix: 'bitcoincash',
  feeBumpCapable: false,
  segwitCapable: false,
  useBitcoinJSSign: false,
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    // Networks.mainnet.xpubkey
    public: 0x0488b21e,
    // Networks.mainnet.xprivkey
    private: 0x0488ade4
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  // Networks.mainnet.privatekey
  wif: 0x80,
  coinType: '145',
  isTestnet: false
}

const bitcoin_cash_testnet: BitcoinCashNetwork = {
  name: 'bitcoin_cash_testnet',
  protocolType: ProtocolType.BitcoinCash,
  prefix: 'bchtest',
  feeBumpCapable: false,
  segwitCapable: false,
  useBitcoinJSSign: false,
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
  coinType: '146',
  isTestnet: true
}

const bitcoin_cash_regtest: BitcoinCashNetwork = {
  name: 'bitcoin_cash_regtest',
  protocolType: ProtocolType.BitcoinCash,
  prefix: 'bchreg',
  feeBumpCapable: false,
  segwitCapable: false,
  useBitcoinJSSign: false,
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
  coinType: '146',
  isTestnet: true
}

const BitcoinCashNetworks = {
  bitcoin_cash,
  bitcoin_cash_testnet,
  bitcoin_cash_regtest
}

export { BitcoinNetworks, BitcoinCashNetworks }
