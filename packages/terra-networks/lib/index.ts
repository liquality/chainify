import { Network } from '@liquality/types'

export interface TerraNetwork extends Network {
  networkId: string
  nodeUrl: string
  helperUrl: string
  chainID: string
  asset: string
  codeId: number
  gasPrices: string
}

const terra_mainnet: TerraNetwork = {
  name: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://lcd.terra.dev',
  helperUrl: 'https://fcd.terra.dev/v1',
  coinType: '397',
  isTestnet: false,
  chainID: 'columbus-5',
  asset: 'luna',
  codeId: 6431, // TODO: Replace after deploying contract on mainnet
  gasPrices: '0.01133uluna'
}

const terra_testnet: TerraNetwork = {
  name: 'testnet',
  networkId: 'testnet',
  nodeUrl: 'https://bombay-lcd.terra.dev',
  helperUrl: 'https://bombay-fcd.terra.dev/v1',
  coinType: '397',
  isTestnet: true,
  chainID: 'bombay-10',
  asset: 'uluna',
  codeId: 7685,
  gasPrices: '0.15uluna'
}

const TerraNetworks = {
  terra_mainnet,
  terra_testnet
}

export { TerraNetworks }
