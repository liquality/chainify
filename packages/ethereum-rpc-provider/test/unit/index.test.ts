/* eslint-env mocha */

import BigNumber from 'bignumber.js'
import chai, { expect } from 'chai'

import Client from '../../../client/lib'
import EthereumRpcProvider from '../../lib'

import mockJsonRpc from '../../../../test/mock/mockJsonRpc'
import ethereumRpc from '../../../../test/mock/ethereum/rpc'

chai.config.truncateThreshold = 0

describe('Ethereum RPC provider', () => {
  let client: Client
  let provider: EthereumRpcProvider

  beforeEach(() => {
    client = new Client()
    provider = new EthereumRpcProvider({ uri: 'http://localhost:8545' })
    client.addProvider(provider)

    mockJsonRpc('http://localhost:8545', ethereumRpc, 100)
  })

  describe('getAddresses', () => {
    it('should return an array of addresses without 0x', async () => {
      const addresses = await client.wallet.getAddresses()
      expect(addresses.map((a) => a)).to.deep.equal([
        { address: '322d4959c911520645c0638204b42ce0689236e9' },
        { address: '635d7d148054b9471d79084b80b864a166956139' },
        { address: 'a17fe13ab28477f17fc7f1ec99a4385c95a5356b' },
        { address: 'd09f520de3fc24ee94fc4fb19f062c4d0cdec6c0' },
        { address: 'fc0853855e11ccb2120434ed97e76f44b55b869e' },
        { address: 'a1bc9766cf6b9f3d7d072430a9de2bdfa94af20b' },
        { address: '786a4faf6ccd016131c66b1cc74dfb8f5f71fa71' },
        { address: '99a2d52e6626998218801a0cf6ddbdf63b6865cd' },
        { address: '47125b17d8f12188d40797631413f9b58fbada80' },
        { address: 'fd5becf2adec096ef511dbab5a48807ae5854116' }
      ])
    })
  })

  describe('getUnusedAddress', () => {
    it('should return first address without 0x', async () => {
      const unusedAddress = await client.wallet.getUnusedAddress()
      expect(unusedAddress).to.deep.equal({ address: '322d4959c911520645c0638204b42ce0689236e9' })
    })
  })

  describe('sendTransaction', () => {
    it('should return a txid without 0x', async () => {
      const tx = await client.chain.sendTransaction({
        to: '635d7d148054b9471d79084b80b864a166956139',
        value: new BigNumber(1000)
      })
      expect(tx.hash).to.match(/^[A-Fa-f0-9]+$/)
      expect(tx.value).to.equal(1000)
    })

    it('returned tx object should have input field', async () => {
      const tx = await client.chain.sendTransaction({
        to: '635d7d148054b9471d79084b80b864a166956139',
        value: new BigNumber(1000),
        data: '1234'
      })
      expect(tx._raw.input).equal('0x1234')
    })
  })

  describe('estimateGas', () => {
    it('should return 21000 when estimate returns 21000', async () => {
      const gas = await provider.estimateGas({
        from: '0x635d7d148054b9471d79084b80b864a166956139',
        to: '0x635d7d148054b9471d79084b80b864a166956139',
        value: '0x1111'
      })
      expect(gas).to.equal(21000)
    })

    it('should multiply gas by 1.5 when tx not simple send', async () => {
      const gas = await provider.estimateGas({
        from: '0x635d7d148054b9471d79084b80b864a166956139',
        to: '0x635d7d148054b9471d79084b80b864a166956139',
        value: '0x1111',
        data: '0x5555'
      })
      expect(gas).to.equal(31548)
    })
  })

  describe('getBlockHeight', () => {
    it('should return block height', async () => {
      const height = await client.chain.getBlockHeight()
      expect(height).to.equal(11)
    })
  })

  describe('getBlockByNumber', () => {
    it('should return a complete block', async () => {
      const block = await client.chain.getBlockByNumber(1, true)
      expect(block).to.deep.equal({
        number: 1,
        hash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
        parentHash: 'f119e45bfae9893ce759772e11a427d67427ceacf2bc04d11d406e4d7ad511da',
        nonce: 0,
        difficulty: 0,
        size: 1000,
        timestamp: 1547632949,
        transactions: [
          {
            hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
            blockHash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
            blockNumber: 1,
            value: 10000,
            confirmations: 11,
            feePrice: 20,
            fee: 1800000000000000,
            _raw: {
              hash: '0xca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
              nonce: '0x0',
              blockHash: '0x868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
              blockNumber: '0x01',
              transactionIndex: '0x00',
              from: '0x322d4959c911520645c0638204b42ce0689236e9',
              to: '0x635d7d148054b9471d79084b80b864a166956139',
              value: '0x2710',
              gas: '0x015f90',
              gasPrice: '0x04a817c800',
              input: '0x0'
            }
          }
        ]
      })
    })
  })

  describe('getTransactionByHash', () => {
    it('should return transaction', async () => {
      const tx = await client.chain.getTransactionByHash(
        'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd'
      )
      expect(tx).to.deep.equal({
        hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
        blockHash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
        blockNumber: 1,
        value: 10000,
        confirmations: 11,
        feePrice: 20,
        fee: 1800000000000000,
        _raw: {
          hash: '0xca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
          nonce: '0x0',
          blockHash: '0x868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
          blockNumber: '0x01',
          transactionIndex: '0x00',
          from: '0x322d4959c911520645c0638204b42ce0689236e9',
          to: '0x635d7d148054b9471d79084b80b864a166956139',
          value: '0x2710',
          gas: '0x015f90',
          gasPrice: '0x04a817c800',
          input: '0x0'
        }
      })
    })
  })

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      const balance = await client.chain.getBalance(['322d4959c911520645c0638204b42ce0689236e9'])
      expect(balance.eq(99995379999999890000)).to.be.true
    })
  })

  describe('signMessage', () => {
    it('should return a signature', async () => {
      const sig = await client.wallet.signMessage('liquality', '322d4959c911520645c0638204b42ce0689236e9')
      expect(sig).to.equal(
        '0f1f169ed203e0a8e053e060e0ba1a7da87cc37f4aa84c9329ba2a63974d0f5b5414b024d80e805418a6f315fd8185e74daaca63fc871c5568e9b18d2f899e4701'
      )
    })
  })

  describe('Non-client methods', () => {
    describe('getTransactionReceipt', () => {
      it('should return transaction receipt for provided transaction', async () => {
        const receipt = await provider.getTransactionReceipt(
          '836a5e038d599454d576493f55c8000d4cce30460437b9e23718154e8f0e4298'
        )
        expect(receipt).to.deep.equal({
          transactionHash: '836a5e038d599454d576493f55c8000d4cce30460437b9e23718154e8f0e4298',
          transactionIndex: '0',
          blockHash: 'bd920a2956a550501eb71e5eb634dc0219eb0830580c45136160b917c948f981',
          blockNumber: 9,
          gasUsed: '5208',
          cumulativeGasUsed: '5208',
          contractAddress: null,
          logs: [],
          status: '1',
          logsBloom:
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        })
      })
    })
  })
})
