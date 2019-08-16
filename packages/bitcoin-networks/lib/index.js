import * as bitcoinjs from 'bitcoinjs-lib'
import { version } from '../package.json'

export default {
  bitcoin: {
    name: 'bitcoin',
    ...bitcoinjs.networks.bitcoin,
    coinType: '0',
    isTestnet: false
  },
  bitcoin_testnet: {
    name: 'bitcoin_testnet',
    ...bitcoinjs.networks.testnet,
    coinType: '1',
    isTestnet: true
  },
  bitcoin_regtest: {
    name: 'bitcoin_regtest',
    ...bitcoinjs.networks.regtest,
    coinType: '1',
    isTestnet: true
  },

  version
}
