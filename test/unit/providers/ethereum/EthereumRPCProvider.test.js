/* eslint-env mocha */

require('chai').config.truncateThreshold = 0
const { expect } = require('chai')

const { Client, providers: { ethereum: { EthereumRPCProvider } } } = require('../../../../src')
const mockJsonRpc = require('../../../mock/mockJsonRpc')
const ethereumRpc = require('../../../mock/ethereum/rpc')

describe('Ethereum RPC provider', () => {
  let client
  let provider

  beforeEach(() => {
    client = new Client()
    provider = new EthereumRPCProvider('http://localhost:8545')
    client.addProvider(provider)

    mockJsonRpc('http://localhost:8545', ethereumRpc, 100)
  })

  describe('getAddresses', () => {
    it('should return an array of addresses without 0x', async () => {
      const addresses = await client.getAddresses()
      expect(addresses).to.deep.equal([
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
      const unusedAddress = await client.getUnusedAddress()
      expect(unusedAddress).to.deep.equal({ address: '322d4959c911520645c0638204b42ce0689236e9' })
    })
  })

  describe('sendTransaction', () => {
    it('should return a txid without 0x', async () => {
      const tx = await client.sendTransaction('635d7d148054b9471d79084b80b864a166956139', 1000)
      expect(tx).to.match(/^[A-Fa-f0-9]+$/)
    })
  })

  describe('getBlockHeight', () => {
    it('should return block height', async () => {
      const height = await client.getBlockHeight()
      expect(height).to.equal(11)
    })
  })

  describe('getBlockByNumber', () => {
    it('should return a complete block', async () => {
      const block = await client.getBlockByNumber(1, true)
      expect(block).to.deep.equal({
        number: 1,
        hash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
        parentHash: 'f119e45bfae9893ce759772e11a427d67427ceacf2bc04d11d406e4d7ad511da',
        mixHash: '0000000000000000000000000000000000000000000000000000000000000000',
        nonce: 0,
        sha3Uncles: '1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
        logsBloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        transactionsRoot: '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        stateRoot: 'f9220de8a2b967110e042de4097ffb126ba09e7acc614c0f8cb963531ae301d7',
        receiptsRoot: '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        miner: '0000000000000000000000000000000000000000',
        difficulty: 0,
        totalDifficulty: '0',
        extraData: '',
        size: 1000,
        gasLimit: '6691b7',
        gasUsed: '5208',
        timestamp: 1547632949,
        transactions: [
          {
            hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
            nonce: 0,
            blockHash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
            blockNumber: 1,
            transactionIndex: '00',
            from: '322d4959c911520645c0638204b42ce0689236e9',
            to: '635d7d148054b9471d79084b80b864a166956139',
            value: 10000,
            gas: '015f90',
            gasPrice: '04a817c800',
            input: '0',
            confirmations: 11
          }
        ],
        uncles: [] })
    })
  })

  describe('getTransactionByHash', () => {
    it('should return block height', async () => {
      const tx = await client.getTransactionByHash('ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd')
      expect(tx)
        .to
        .deep
        .equal({
          hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
          nonce: 0,
          blockHash: '868b4c97d842aa758dfc97834088aee0687410365140adc4bebbc4c02b0eddc3',
          blockNumber: 1,
          transactionIndex: '00',
          from: '322d4959c911520645c0638204b42ce0689236e9',
          to: '635d7d148054b9471d79084b80b864a166956139',
          value: 10000,
          gas: '015f90',
          gasPrice: '04a817c800',
          input: '0',
          confirmations: 11
        })
    })
  })

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      const balance = await client.getBalance([ '322d4959c911520645c0638204b42ce0689236e9' ])
      expect(balance)
        .to
        .equal(99995379999999890000)
    })
  })

  describe('isAddressUsed', () => {
    it('should return true for a used address', async () => {
      const isUsed = await client.isAddressUsed('322d4959c911520645c0638204b42ce0689236e9')
      expect(isUsed)
        .to
        .equal(true)
    })
  })

  describe('signMessage', () => {
    it('should return a signature', async () => {
      const sig = await client.signMessage('liquality', '322d4959c911520645c0638204b42ce0689236e9')
      expect(sig)
        .to
        .equal('0f1f169ed203e0a8e053e060e0ba1a7da87cc37f4aa84c9329ba2a63974d0f5b5414b024d80e805418a6f315fd8185e74daaca63fc871c5568e9b18d2f899e4701')
    })
  })

  describe('Non-client methods', () => {
    describe('getTransactionReceipt', () => {
      it('should return transaction receipt for provided transaction', async () => {
        const receipt = await provider.getTransactionReceipt('836a5e038d599454d576493f55c8000d4cce30460437b9e23718154e8f0e4298')
        expect(receipt)
          .to
          .deep
          .equal({
            transactionHash: '836a5e038d599454d576493f55c8000d4cce30460437b9e23718154e8f0e4298',
            transactionIndex: '0',
            blockHash: 'bd920a2956a550501eb71e5eb634dc0219eb0830580c45136160b917c948f981',
            blockNumber: 9,
            gasUsed: '5208',
            cumulativeGasUsed: '5208',
            contractAddress: null,
            logs: [],
            status: '1',
            logsBloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          })
      })
    })
  })
})
