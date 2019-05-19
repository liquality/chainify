import { version } from '../package.json'

export default {
  bitcoin: {
    name: 'bitcoin',
    pubKeyHash: '00',
    scriptHash: '05',
    coinType: '0',
    explorerUrl: 'https://blockstream.info/',
    wif: 0x80,
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    isTestnet: false
  },
  bitcoin_testnet: {
    name: 'bitcoin_testnet',
    pubKeyHash: '6F',
    scriptHash: 'C4',
    coinType: '1',
    explorerUrl: 'https://blockstream.info/testnet/',
    wif: 0xef,
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    isTestnet: true
  },

  version
}
