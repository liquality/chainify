import * as coininfo from 'coininfo'
import { version } from '../package.json'

export default {
  litecoin: {
    name: 'litecoin',
	messagePrefix: '\u0018Litecoin Signed Message:\n',
	...coininfo.litecoin.main.versions,
	scriptHash: 5,
	scriptHash2: 5,
	bech32: 'ltc',
	pubKeyHash: 48,
	wif: 176,
    coinType: '0',
    isTestnet: false
  },
  litecoin_testnet: {
    name: 'litecoin_testnet',
	messagePrefix: '\u0018Litecoin Signed Message:\n',
	...coininfo.litecoin.test.versions,
	bech32: 'tltc',
	scriptHash: 196,
	scriptHash2: 58,
	pubKeyHash: 111,
	wif: 239,
    coinType: '1',
    isTestnet: true
  },
  litecoin_regtest: {
    name: 'litecoin_regtest',
	messagePrefix: '\u0018Litecoin Signed Message:\n',
	...coininfo.litecoin.test.versions,
	bech32: 'rltc',
	scriptHash: 196,
	scriptHash2: 58,
	pubKeyHash: 111,
	wif: 239,
    coinType: '1',
    isTestnet: true
  },

  version
}
