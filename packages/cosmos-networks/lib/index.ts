import { Network, cosmos } from '@liquality/types'

export interface CosmosNetwork extends Network {
  network: string
  rpcUrl: string
  apiUrl?: string
  defaultCurrency: cosmos.Currency // staking and fee currency
  addressPrefix: string
  minimalGasPrice: number
  derivationPath?: string
  faucetUrl?: string
}

const cosmoshub_mainnet_atom: CosmosNetwork = {
  name: 'cosmoshub_mainnet',
  network: 'cosmoshub-4',
  rpcUrl: 'https://rpc.cosmos.network:443',
  apiUrl: 'https://api.cosmos.network:443',
  defaultCurrency: {
    coinDenom: 'ATOM',
    coinMinimalDenom: 'uatom',
    coinDecimals: 6
  },
  coinType: '118',
  addressPrefix: 'cosmos',
  minimalGasPrice: 0.025, // default value
  isTestnet: false
}

const cosmoshub_testnet_photon: CosmosNetwork = {
  name: 'cosmoshub-testnet',
  network: 'cosmoshub-testnet',
  rpcUrl: 'https://rpc.testnet.cosmos.network:443',
  apiUrl: 'https://api.testnet.cosmos.network:443',
  faucetUrl: 'https://faucet.testnet.cosmos.network:443',
  defaultCurrency: {
    coinDenom: 'PHOTON',
    coinMinimalDenom: 'uphoton',
    coinDecimals: 6
  },
  coinType: '118',
  addressPrefix: 'cosmos',
  minimalGasPrice: 0.025, // default value
  isTestnet: true
}

const akash_testnet_akt: CosmosNetwork = {
  name: 'akash-testnet',
  network: 'akash-testnet-6',
  rpcUrl: 'http://147.75.32.35:26657',
  apiUrl: 'http://147.75.32.11:1317',
  defaultCurrency: {
    coinDenom: 'AKT',
    coinMinimalDenom: 'uakt',
    coinDecimals: 6
  },
  coinType: '118',
  addressPrefix: 'akash',
  minimalGasPrice: 0.025, // default value
  isTestnet: true
}

const cryptoorg_testnet_tcro: CosmosNetwork = {
  name: 'cryptoorg-testnet',
  network: 'testnet-croeseid-2',
  rpcUrl: 'https://testnet-croeseid-3.crypto.org:26657',
  apiUrl: 'https://testnet-croeseid-3.crypto.org:1317',
  defaultCurrency: {
    coinDenom: 'TCRO',
    coinMinimalDenom: 'basetcro',
    coinDecimals: 8
  },
  coinType: '394',
  addressPrefix: 'tcro', // testnet only prefix
  minimalGasPrice: 0.025, // default value
  isTestnet: true
}

const starname_testnet_voi: CosmosNetwork = {
  name: 'starname_testnet',
  network: 'iovns-galaxynet',
  rpcUrl: 'https://rpc.cluster-stargatenet.iov.one/',
  apiUrl: 'https://api.cluster-stargatenet.iov.one/',
  defaultCurrency: {
    coinDenom: 'VOI',
    coinMinimalDenom: 'uvoi',
    coinDecimals: 6
  },
  coinType: '234',
  addressPrefix: 'star',
  minimalGasPrice: 1,
  isTestnet: true
}

const CosmosNetworks = {
  cosmoshub_mainnet_atom,
  cosmoshub_testnet_photon,
  akash_testnet_akt,
  cryptoorg_testnet_tcro,
  starname_testnet_voi
}

export { CosmosNetworks }
