export default {
  bitcoin: {
    name: 'bitcoin',
    pubKeyHash: '00',
    scriptHash: '05',
    coinType: '0',
    explorerUrl: 'https://blockchain.info',
    wif: 0x80,
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    }
  },
  bitcoin_testnet: {
    name: 'bitcoin_testnet',
    pubKeyHash: '6F',
    scriptHash: 'C4',
    coinType: '1',
    explorerUrl: 'https://testnet.blockchain.info',
    wif: 0xef,
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    }
  },
  litecoin: {
    name: 'litecoin',
    pubKeyHash: '30',
    scriptHash: '32',
    coinType: '2',
    bip32: {
      private: 0x019d9cfe,
      public: 0x019da462
    }
  },
  ethereum: {
    name: 'ethereum',
    coinType: '60'
  },
  ethereum_classic: {
    name: 'ethereum_classic',
    coinType: '61'
  }
}
