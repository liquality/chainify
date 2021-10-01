import { Network } from '@liquality/types'
export interface FlowNetwork extends Network {
  network: string
  rpcUrl: string
  discoveryWallet: string
  accountAPI: string
  helperUrl?: string
  derivationPath?: string
}

const flow_mainnet: FlowNetwork = {
  name: 'flow_mainnet',
  network: 'flow_mainnet',
  rpcUrl: 'https://access-mainnet-beta.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
  helperUrl: 'https://flowscan.org',
  accountAPI: 'http://localhost:8081/', // TODO: get the correct one
  coinType: '539',
  isTestnet: false
}

const flow_testnet: FlowNetwork = {
  name: 'flow_testnet',
  network: 'flow_testnet',
  rpcUrl: 'https://access-testnet.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
  helperUrl: 'https://testnet.flowscan.org',
  accountAPI: 'http://localhost:8081/', // TODO: get the correct one
  coinType: '539',
  isTestnet: true
}

const FlowNetworks = {
  flow_mainnet,
  flow_testnet
}

export { FlowNetworks }
