import { Network } from '@liquality/types'
export interface FlowNetwork extends Network {
  network: string
  rpcUrl: string
  discoveryWallet: string
  accountAPI: string
  helperUrl?: string
  derivationPath?: string
  fungibleTokenAddress: string
  flowTokenAddress: string
  fusdTokenAddress: string
}

const flow_mainnet: FlowNetwork = {
  name: 'flow_mainnet',
  network: 'flow_mainnet',
  rpcUrl: 'https://access-mainnet-beta.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
  helperUrl: 'https://flowscan.org',
  accountAPI: 'http://localhost:8081/', // TODO: get the correct one
  coinType: '539',
  isTestnet: false,
  fungibleTokenAddress: '0xf233dcee88fe0abe',
  flowTokenAddress: '0x1654653399040a61',
  fusdTokenAddress: '0x3c5959b568896393'
}

const flow_testnet: FlowNetwork = {
  name: 'flow_testnet',
  network: 'flow_testnet',
  rpcUrl: 'https://access-testnet.onflow.org',
  discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
  helperUrl: 'https://testnet.flowscan.org',
  accountAPI: 'http://localhost:8081/', // TODO: get the correct one
  coinType: '539',
  isTestnet: true,
  fungibleTokenAddress: '0x9a0766d93b6608b7',
  flowTokenAddress: '0x7e60df042a9c0868',
  fusdTokenAddress: '0xe223d8a629e49c68'
}

const FlowNetworks = {
  flow_mainnet,
  flow_testnet
}

export { FlowNetworks }
