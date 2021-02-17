import { networks } from 'bitcoinjs-lib'
import { version } from '../package.json'

export default {
  bitcoin: {
    name: 'bitcoin',
    ...networks.bitcoin,
    coinType: '0',
    isTestnet: false
  },
  bitcoin_testnet: {
    name: 'bitcoin_testnet',
    ...networks.testnet,
    coinType: '1',
    isTestnet: true
  },
  bitcoin_regtest: {
    name: 'bitcoin_regtest',
    ...networks.regtest,
    coinType: '1',
    isTestnet: true
  },

  version
}
