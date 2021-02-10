import { Network } from 'bitcoinjs-lib'

export interface BitcoinNetwork extends Network {
  name: string,
  coinType: string,
  isTestnet: boolean
}
