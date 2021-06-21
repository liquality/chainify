import { Network } from '@liquality/types'

export interface SolanaNetwork extends Network {
  nodeUrl: string
  helperUrl: string
  walletIndex: number
}

const solana_mainnet: SolanaNetwork = {
  name: 'mainnet',
  nodeUrl: 'https://api.mainnet-beta.solana.com',
  helperUrl: 'https://explorer.solana.com/',
  coinType: '397', // Need to check this cointype
  isTestnet: false,
  walletIndex: 0
}

const solana_testnet: SolanaNetwork = {
  name: 'devnet',
  nodeUrl: 'https://api.devnet.solana.com',
  helperUrl: 'https://explorer-api.devnet.solana.com/',
  coinType: '397', // Need to check this cointype
  isTestnet: true,
  walletIndex: 0
}

const SolanaNetworks = {
  solana_mainnet,
  solana_testnet
}

export { SolanaNetworks }
