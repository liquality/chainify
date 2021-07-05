import { Network } from '@liquality/types'

export interface EthereumNetwork extends Network {
  networkId: number
  chainId: number
}

const ethereum_mainnet: EthereumNetwork = {
  name: 'ethereum_mainnet',
  coinType: '60',
  networkId: 1,
  chainId: 1,
  isTestnet: false
}

const classic_mainnet: EthereumNetwork = {
  name: 'classic_mainnet',
  coinType: '61',
  networkId: 1,
  chainId: 61,
  isTestnet: false
}

const ropsten: EthereumNetwork = {
  name: 'ropsten',
  coinType: '60',
  networkId: 3,
  chainId: 3,
  isTestnet: true
}

const rinkeby: EthereumNetwork = {
  name: 'rinkeby',
  coinType: '60',
  networkId: 4,
  chainId: 4,
  isTestnet: true
}

const kovan: EthereumNetwork = {
  name: 'kovan',
  coinType: '60',
  networkId: 42,
  chainId: 42,
  isTestnet: true
}

const goerli: EthereumNetwork = {
  name: 'goerli',
  coinType: '60',
  networkId: 5,
  chainId: 5,
  isTestnet: true
}

const rsk_mainnet: EthereumNetwork = {
  name: 'rsk_mainnet',
  coinType: '137',
  networkId: 30,
  chainId: 30,
  isTestnet: false
}

const rsk_testnet: EthereumNetwork = {
  name: 'rsk_testnet',
  coinType: '37310',
  networkId: 31,
  chainId: 31,
  isTestnet: true
}

const rsk_regtest: EthereumNetwork = {
  name: 'rsk_regtest',
  coinType: '37310',
  networkId: 33,
  chainId: 33,
  isTestnet: true
}

const bsc_mainnet: EthereumNetwork = {
  name: 'bsc_mainnet',
  coinType: '60',
  networkId: 56,
  chainId: 56,
  isTestnet: false
}

const bsc_testnet: EthereumNetwork = {
  name: 'bsc_testnet',
  coinType: '60',
  networkId: 97,
  chainId: 97,
  isTestnet: true
}

const polygon_mainnet: EthereumNetwork = {
  name: 'polygon_mainnet',
  coinType: '60',
  networkId: 137,
  chainId: 137,
  isTestnet: false
}

const polygon_testnet: EthereumNetwork = {
  name: 'polygon_testnet',
  coinType: '60',
  networkId: 80001,
  chainId: 80001,
  isTestnet: true
}

const arbitrum_mainnet: EthereumNetwork = {
  name: 'arbitrum_mainnet',
  coinType: '60',
  networkId: 42161,
  chainId: 42161,
  isTestnet: false
}

const arbitrum_testnet: EthereumNetwork = {
  name: 'arbitrum_testnet',
  coinType: '60',
  networkId: 421611,
  chainId: 421611,
  isTestnet: true
}

const local: EthereumNetwork = {
  name: 'local',
  coinType: '60',
  networkId: 1337,
  chainId: 1337,
  isTestnet: true
}

const EthereumNetworks = {
  ethereum_mainnet,
  classic_mainnet,
  ropsten,
  rinkeby,
  kovan,
  goerli,
  rsk_mainnet,
  rsk_testnet,
  rsk_regtest,
  bsc_mainnet,
  bsc_testnet,
  polygon_mainnet,
  polygon_testnet,
  arbitrum_testnet,
  arbitrum_mainnet,
  local
}

export { EthereumNetworks }
