/* eslint-env mocha */
import chai, { expect } from 'chai'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'

import { Client } from '../../../client/lib'
import { SolanaRpcProvider } from '../../lib'
import { SolanaNetworks } from '../../../solana-networks'
import { describeExternal } from '../../../../test/integration/common'
import { SolanaSwapFindProvider } from '../../../solana-swap-find-provider/lib'
import { SolanaSwapProvider } from '../../../solana-swap-provider/lib'
import { SolanaWalletProvider } from '../../../solana-wallet-provider/lib'

chai.config.truncateThreshold = 0

describe('Solana RPC provider', () => {
  let client: Client
  let provider: any

  beforeEach(() => {
    client = new Client()
    provider = new SolanaRpcProvider(SolanaNetworks.solana_testnet)
    client.addProvider(provider)
    client.addProvider(new SolanaSwapProvider(SolanaNetworks.solana_testnet))
    client.addProvider(
      new SolanaWalletProvider({
        network: SolanaNetworks.solana_testnet,
        mnemonic:
          'parade answer giggle alert scrap squirrel improve issue rabbit enlist output bullet uncle dismiss blood illness wear snap mass grit black spare purchase regular',
        derivationPath: `m/44'/501'/0'/0'`
      })
    )
    client.addProvider(new SolanaSwapFindProvider(SolanaNetworks.solana_testnet))
  })

  describe('getBlockNumber', () => {
    it('should return block by number', async () => {
      const currentBlock = await client.getMethod('getBlockHeight')()

      await client.chain.getBlockByNumber(currentBlock, false)
    })
  })

  describeExternal('getBalance', () => {
    it('should return user balance', async () => {
      await client.chain.getBalance(['9U5t5Nn3BAdasm8j3sQ273TsM7YZvUAjYcD16qhhNi5P'])
    })
  })

  describeExternal('getBalance', () => {
    it('should return 0 if balance do not exist', async () => {
      const keyPair = new Keypair()

      const balance = await client.chain.getBalance([keyPair.publicKey.toString()])

      expect(balance.toNumber()).to.equal(0)
    })
  })

  describeExternal('getTransactionByHash', () => {
    it('should get tx by hash', async () => {
      const txHash = '3Xu7GVdUrcx1wNXJJCGe7TuVB8RqSqkQA2ioReDZpGPyo6648otdZfaDRetpYjuK4MSizFF8469V7RDYwYDzdbDQ'

      const tx = await client.chain.getTransactionByHash(txHash)

      expect(tx.value).to.equal(LAMPORTS_PER_SOL * 2)
    })
  })
})
