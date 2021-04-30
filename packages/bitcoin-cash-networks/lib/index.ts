import { Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib'
import { Network } from '@liquality/types'

export interface BitcoinCashNetwork extends Network, BitcoinJsLibNetwork { }

// Use the same derivation path as Electron Cash
// https://www.reddit.com/r/btc/comments/a8jja9/psa_figuring_out_the_correct_hd_derivation_paths/ecbh3ri

const bitcoin_cash: BitcoinCashNetwork = {
  name: 'bitcoin_cash',
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    // Networks.mainnet.xpubkey
    public: 0x0488b21e,
    // Networks.mainnet.xprivkey
    private: 0x0488ade4,
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
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
  coinType: '146',
  isTestnet: true
}

const bitcoin_cash_regtest: BitcoinCashNetwork = {
  name: 'bitcoin_cash_regtest',
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
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

export default BitcoinCashNetworks
