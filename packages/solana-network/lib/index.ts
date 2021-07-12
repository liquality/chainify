import { Network } from '@liquality/types'

export interface SolanaNetwork extends Network {
  nodeUrl: string
  helperUrl: string
  walletIndex: number
  programId: string
}

const solana_mainnet: SolanaNetwork = {
  name: 'mainnet',
  nodeUrl: 'https://api.mainnet-beta.solana.com',
  helperUrl: 'https://explorer.solana.com/',
  coinType: '501',
  isTestnet: false,
  walletIndex: 0,
  programId: '!!! TODO: REPLACE AFTER DEPLOY ON THE MAINNET !!!'
}

const solana_testnet: SolanaNetwork = {
  name: 'devnet',
  nodeUrl: 'http://liquality.devnet.rpcpool.com/',
  helperUrl: 'https://explorer-api.devnet.solana.com/',
  coinType: '501',
  isTestnet: true,
  walletIndex: 0,
  programId: '4B9k2YntFxQC93MezXZB3AKLsLrEaqDdXEaPmgTTF5WX'
}

const SolanaNetworks = {
  solana_mainnet,
  solana_testnet
}

export { SolanaNetworks }
