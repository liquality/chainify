import { Network, cosmos } from '@liquality/types'

export interface CosmosNetwork extends Network {
  network: string
  rpcUrl: string
  apiUrl?: string
  grpcUrl?: string
  defaultCurrencies: cosmos.Currency[] // staking and fee currency
  addressPrefix: string
  derivationPath?: string
  faucetUrl?: string
}

const cosmoshub_mainnet_atom: CosmosNetwork = {
  name: 'cosmoshub_mainnet',
  network: 'cosmoshub-4',
  rpcUrl: 'https://rpc.cosmos.network:443',
  apiUrl: 'https://api.cosmos.network:443',
  grpcUrl: 'https://grpc.cosmos.network:443',
  defaultCurrencies: [
    {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6
    }
  ],
  coinType: '118',
  addressPrefix: 'cosmos',
  isTestnet: false
}

const cosmoshub_testnet_photon: CosmosNetwork = {
  name: 'cosmoshub-testnet',
  network: 'cosmoshub-testnet',
  rpcUrl: 'https://rpc.testnet.cosmos.network:443',
  apiUrl: 'https://api.testnet.cosmos.network:443',
  grpcUrl: 'https://grpc.testnet.cosmos.network:443',
  faucetUrl: 'https://faucet.testnet.cosmos.network:443',
  defaultCurrencies: [
    {
      coinDenom: 'PHOTON',
      coinMinimalDenom: 'uphoton',
      coinDecimals: 6
    }
  ],
  coinType: '118',
  addressPrefix: 'cosmos',
  isTestnet: true
}

// secret have not yet migrated to Stargate
// const secretNetwork_testnet_scrt: CosmosNetwork = {
//   name: 'secret-testnet',
//   network: 'holodeck-2',
//   rpcUrl: 'http://bootstrap.secrettestnet.io:26657',
//   defaultCurrencies: [
//     {
//       coinDenom: 'SCRT',
//       coinMinimalDenom: 'uscrt',
//       coinDecimals: 6
//     }
//   ],
//   coinType: '118',
//   addressPrefix: 'secret',
//   isTestnet: true
// }

const akash_testnet_akt: CosmosNetwork = {
  name: 'akash-testnet',
  network: 'akash-testnet-6',
  rpcUrl: 'http://147.75.32.35:26657',
  apiUrl: 'http://147.75.32.11:1317',
  defaultCurrencies: [
    {
      coinDenom: 'AKT',
      coinMinimalDenom: 'uakt',
      coinDecimals: 6
    }
  ],
  coinType: '118',
  addressPrefix: 'akash',
  isTestnet: true
}

// still on older version
// const starname_testnet_iov: CosmosNetwork = {
//   name: 'starname_testnet',
//   network: 'iovns-galaxynet',
//   rpcUrl: 'https://rpc.cluster-galaxynet.iov.one/',
//   apiUrl: 'https://api.cluster-galaxynet.iov.one/',
//   defaultCurrencies: [
//     {
//       coinDenom: 'IOV',
//       coinMinimalDenom: 'uiov',
//       coinDecimals: 6
//     }
//   ],
//   coinType: '118',
//   addressPrefix: 'star',
//   isTestnet: true
// }

const CosmosNetworks = {
  cosmoshub_mainnet_atom,
  cosmoshub_testnet_photon,
  // secretNetwork_testnet_scrt,
  akash_testnet_akt
  // starname_testnet_iov
}

export { CosmosNetworks }
