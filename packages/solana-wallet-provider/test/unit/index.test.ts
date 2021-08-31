/* eslint-env mocha */
import chai from 'chai'

import { Client } from '../../../client/lib'
import { SolanaWalletProvider } from '../../lib'
import { SolanaRpcProvider } from '../../../solana-rpc-provider'
import { SolanaNetworks } from '../../../solana-networks'

chai.config.truncateThreshold = 0

const network = SolanaNetworks.solana_testnet
const derivationPath = `m/44'/501'/0'/0'`
const rpcProvider = new SolanaRpcProvider(network)

const mnemonic =
  'mixed leader indoor danger you below wall rally coil key witness wedding elephant bunker edit fatal swallow penalty banana antique total fame sunny cash'

describe('Solana JS Wallet Provider provider', () => {
  describe('getAddresses', () => {
    it('should return top level account', async () => {
      const client = new Client()

      const provider = new SolanaWalletProvider({
        network,
        mnemonic,
        derivationPath
      })

      client.addProvider(provider)
      client.addProvider(rpcProvider)
      await client.wallet.getAddresses()
    })
  })
})
