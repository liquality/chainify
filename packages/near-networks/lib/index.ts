import { Network } from '@liquality/types'

export interface NearNetwork extends Network {
  networkId: string
  nodeUrl: string
  helperUrl: string
}

const near_mainnet: NearNetwork = {
  name: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  coinType: '397',
  isTestnet: false
}

const near_testnet: NearNetwork = {
  name: 'testnet',
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  coinType: '397',
  isTestnet: true
}

const NearNetworks = {
  near_mainnet,
  near_testnet
}

export { NearNetworks }
