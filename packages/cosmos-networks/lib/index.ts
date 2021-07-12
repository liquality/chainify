import { Network } from '@liquality/types'

export interface CosmosNetwork extends Network {
  network: string
  rpcUrl: string
  apiUrl: string
  grpcUrl: string
  token: string
  faucetUrl?: string
}

const cosmoshub_mainnet: CosmosNetwork = {
  name: 'mainnet',
  network: 'cosmoshub-4',
  rpcUrl: 'https://rpc.cosmos.network:443',
  apiUrl: 'https://api.cosmos.network:443',
  grpcUrl: 'https://grpc.cosmos.network:443',
  token: 'uatom',
  coinType: '118',
  isTestnet: false
}

const cosmoshub_testnet: CosmosNetwork = {
  name: 'testnet',
  network: 'cosmoshub-testnet',
  rpcUrl: 'https://rpc.testnet.cosmos.network:443',
  apiUrl: 'https://api.testnet.cosmos.network:443',
  grpcUrl: 'https://grpc.testnet.cosmos.network:443',
  faucetUrl: 'https://faucet.testnet.cosmos.network:443',
  token: 'uphoton',
  coinType: '118',
  isTestnet: true
}

const CosmosNetworks = {
  cosmoshub_mainnet,
  cosmoshub_testnet
}

export { CosmosNetworks }
