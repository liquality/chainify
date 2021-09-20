import { Network } from '@liquality/types'
export interface FlowNetwork extends Network {
  network: string
  rpcUrl: string
  discoveryWallet: string
  minimalGasPrice: number
  derivationPath?: string
  faucetUrl?: string
}

const flow_mainnet: FlowNetwork = {
  name: 'flow_mainnet',
  network: 'flow_mainnet',
  rpcUrl: 'https://access.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
  coinType: '118', // TODO: set proper value
  minimalGasPrice: 0.025, // TODO: set proper value
  isTestnet: false
}

const flow_testnet: FlowNetwork = {
  name: 'flow_testnet',
  network: 'flow_testnet',
  rpcUrl: 'https://access-testnet.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn', // TODO: this one seems incorrect
  coinType: '118', // TODO: set proper value
  minimalGasPrice: 0.025, // TODO: set proper value
  isTestnet: true
}

const FlowNetworks = {
  flow_mainnet,
  flow_testnet
}

export { FlowNetworks }
