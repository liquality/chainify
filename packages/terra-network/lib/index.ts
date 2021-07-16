import { Network } from '@liquality/types'

export interface TerraNetwork extends Network {
  networkId: string
  nodeUrl: string
  helperUrl: string
  chainID: string
}

const terra_mainnet: TerraNetwork = {
  name: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://lcd.terra.dev',
  helperUrl: 'https://finder.terra.money',
  coinType: '397',
  isTestnet: false,
  chainID: 'columbus-4'
}

const terra_testnet: TerraNetwork = {
  name: 'testnet',
  networkId: 'testnet',
  nodeUrl: 'https://tequila-lcd.terra.dev',
  helperUrl: 'https://finder.terra.money/tequila-0004',
  coinType: '397',
  isTestnet: true,
  chainID: 'tequila-0004'
}

const TerraNetworks = {
  terra_mainnet,
  terra_testnet
}

export { TerraNetworks }
