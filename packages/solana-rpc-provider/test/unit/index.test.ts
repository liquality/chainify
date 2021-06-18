/* eslint-env mocha */
import chai, { expect } from 'chai'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'

import { Client } from '../../../client/lib'
import { SolanaRpcProvider } from '../../lib'
import { SolanaNetworks } from '../../../solana-network'

chai.config.truncateThreshold = 0

describe('Solana RPC provider', () => {
  let client: Client
  let provider: any

  beforeEach(() => {
    client = new Client()
    provider = new SolanaRpcProvider(SolanaNetworks.solana_testnet)
    client.addProvider(provider)
  })

  describe('getBlockNumber', () => {
    it('should return block by number', async () => {
      const blockNumber = 62_724_331
      await client.chain.getBlockByNumber(blockNumber, false)
    })
  })

  describe('getBalance', () => {
    it('should return user balance', async () => {
      await client.chain.getBalance(['9U5t5Nn3BAdasm8j3sQ273TsM7YZvUAjYcD16qhhNi5P'])
    })
  })

  describe('getBalance', () => {
    it('should return 0 if balance do not exist', async () => {
      const keyPair = new Keypair()

      const balance = await client.chain.getBalance([keyPair.publicKey.toString()])

      expect(balance.toNumber()).to.equal(0)
    })
  })

  describe('getTransactionByHash', () => {
    it('should get tx by hash', async () => {
      const txHash = '3Xu7GVdUrcx1wNXJJCGe7TuVB8RqSqkQA2ioReDZpGPyo6648otdZfaDRetpYjuK4MSizFF8469V7RDYwYDzdbDQ'

      const tx = await client.chain.getTransactionByHash(txHash)

      expect(tx.value).to.equal(LAMPORTS_PER_SOL * 2)
    })
  })
})
