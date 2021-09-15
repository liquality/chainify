import { Network } from '@liquality/types'

export interface FlowNetwork extends Network {
  networkId: string
  nodeUrl: string
  helperUrl: string
}

const flow_mainnet: FlowNetwork = {
  name: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  helperUrl: 'https://flowscan.org',
  coinType: '397',
  isTestnet: false
}

const flow_testnet: FlowNetwork = {
  name: 'testnet',
  networkId: 'testnet',
  nodeUrl: 'https://access-testnet.onflow.org',
  helperUrl: 'https://testnet.flowscan.org',
  coinType: '397',
  isTestnet: true
}

const FlowNetworks = {
  flow_mainnet,
  flow_testnet
}

export { FlowNetworks }
