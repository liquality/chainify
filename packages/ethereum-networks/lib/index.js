import { version } from '../package.json'

export default {
  mainnet: {
    name: 'mainnet',
    coinType: '60',
    networkId: 1,
    chainId: 1,
    isTestnet: false
  },
  classic_mainnet: {
    name: 'classic_mainnet',
    coinType: '61',
    neworkId: 1,
    chainId: 61,
    isTestnet: false
  },
  ropsten: {
    name: 'ropsten',
    coinType: '60',
    networkId: 3,
    chainId: 3,
    isTestnet: true
  },
  rinkeby: {
    name: 'rinkeby',
    coinType: '60',
    networkId: 4,
    chainId: 4,
    isTestnet: true
  },
  kovan: {
    name: 'kovan',
    coinType: '60',
    networkId: 42,
    chainId: 42,
    isTestnet: true
  },
  goerli: {
    name: 'goerli',
    coinType: '60',
    networkId: 5,
    chainId: 5,
    isTestnet: true
  },
  local: {
    name: 'local',
    coinType: '60',
    isTestnet: true
  },

  version
}
