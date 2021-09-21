import { Network } from '@liquality/types'
export interface FlowNetwork extends Network {
  network: string
  rpcUrl: string
  discoveryWallet: string
  helperUrl?: string
  derivationPath?: string
}

// TODO: test mainnet
const flow_mainnet: FlowNetwork = {
  name: 'flow_mainnet',
  network: 'flow_mainnet',
  rpcUrl: 'https://access.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
  helperUrl: 'https://flowscan.org',
  coinType: '539',
  isTestnet: false
}

const flow_testnet: FlowNetwork = {
  name: 'flow_testnet',
  network: 'flow_testnet',
  rpcUrl: 'https://access-testnet.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
  helperUrl: 'https://testnet.flowscan.org',
  coinType: '539',
  isTestnet: true
}

const FlowNetworks = {
  flow_mainnet,
  flow_testnet
}

export { FlowNetworks }
