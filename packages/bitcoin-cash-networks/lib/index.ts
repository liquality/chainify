import { Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib'
import { Networks } from 'bitcore-lib-cash'
import { Network } from '@liquality/types'

export interface BitcoinCashNetwork extends Network, BitcoinJsLibNetwork { }

// Use the same derivation path as Electron Cash
// https://www.reddit.com/r/btc/comments/a8jja9/psa_figuring_out_the_correct_hd_derivation_paths/ecbh3ri

const bitcoin_cash: BitcoinCashNetwork = {
  name: 'bitcoin_cash',
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: (Networks as any).mainnet.xpubkey,
    private: (Networks as any).mainnet.xprivkey,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: (Networks as any).mainnet.privatekey,
  coinType: '145',
  isTestnet: false
}

const bitcoin_cash_testnet: BitcoinCashNetwork = {
  name: 'bitcoin_cash_testnet',
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: (Networks as any).testnet.xpubkey,
    private: (Networks as any).testnet.xprivkey,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: (Networks as any).testnet.privatekey,
  coinType: '146',
  isTestnet: true
}

const bitcoin_cash_regtest: BitcoinCashNetwork = {
  name: 'bitcoin_cash_regtest',
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: (Networks as any).regtest.xpubkey,
    private: (Networks as any).regtest.xprivkey,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: (Networks as any).regtest.privatekey,
  coinType: '146',
  isTestnet: true
}

const BitcoinCashNetworks = {
  bitcoin_cash,
  bitcoin_cash_testnet,
  bitcoin_cash_regtest
}

export default BitcoinCashNetworks
