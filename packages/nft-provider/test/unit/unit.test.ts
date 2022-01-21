/* eslint-env mocha */

import { Client } from '../../../client/lib'
import { NftProvider } from '../../lib'

import { EthereumRpcProvider } from '../../../ethereum-rpc-provider/lib'
import { EthereumJsWalletProvider } from '../../../ethereum-js-wallet-provider/lib'
import { EthereumNetworks } from '../../../ethereum-networks/lib'
import { EthereumEIP1559FeeProvider } from '../../../ethereum-eip1559-fee-provider/lib'

import chai, { expect } from 'chai'

chai.config.truncateThreshold = 0

const openSeaAPI = 'https://rinkeby-api.opensea.io/api/v1/'
const infura = '' // 'https://rinkeby.infura.io/v3/...'
const mnemonic = ''

const contract721 = '0xE5BB2D0e0C86021Bb68fF6a47447e37fe0eC2A27'
const contract1155 = '0x6d8bE0FFbBdF508d669AdFb04F7d8aD414de44b0'

const address_1 = ''
const address_2 = ''

xdescribe('Nft provider', () => {
  let clients: Client[]

  beforeEach(() => {
    clients = [new Client(), new Client()]

    clients[0].addProvider(new EthereumRpcProvider({ uri: infura }))
    clients[0].addProvider(new EthereumEIP1559FeeProvider({ uri: infura }))
    clients[0].addProvider(
      new EthereumJsWalletProvider({
        network: EthereumNetworks.rinkeby,
        mnemonic: mnemonic,
        derivationPath: `m/44'/${EthereumNetworks.rinkeby.coinType}'/0'/0/0`,
        hardfork: 'london'
      })
    )
    clients[0].addProvider(new NftProvider(openSeaAPI))

    clients[1].addProvider(new EthereumRpcProvider({ uri: infura }))
    clients[1].addProvider(new EthereumEIP1559FeeProvider({ uri: infura }))
    clients[1].addProvider(
      new EthereumJsWalletProvider({
        network: EthereumNetworks.rinkeby,
        mnemonic: mnemonic,
        derivationPath: `m/44'/${EthereumNetworks.rinkeby.coinType}'/0'/0/1`,
        hardfork: 'london'
      })
    )
    clients[1].addProvider(new NftProvider(openSeaAPI))
  })

  describe('fetch', () => {
    it('Should return users nfts', async () => {
      const nfts = await clients[0].nft.fetch()
      expect(nfts).to.have.deep.property('assets')
      expect(nfts.assets).to.be.an('array')
      expect(nfts.assets.length).to.be.greaterThan(0)
    })
  })

  describe('balance', () => {
    it('Should return user balance', async () => {
      const balance721 = await clients[0].nft.balance(contract721)
      expect(balance721).to.be.equal(3)

      let balance1155 = await clients[0].nft.balance(contract1155, [2, 8, 51, 100])
      expect(balance1155).to.be.an('array')
      expect(balance1155).to.deep.equal([1, 1, 1, 0])

      balance1155 = await clients[0].nft.balance(contract1155, [2])
      expect(balance1155).not.to.be.an('array')
      expect(balance1155).to.be.equal(1)
    })
  })

  describe('transfer', () => {
    it('Should transfer nfts ERC721', async () => {
      const tx721 = await clients[0].nft.transfer(contract721, address_2, [1])
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      const balance_1 = await clients[0].nft.balance(contract721)
      expect(balance_1).to.be.equal(2)
      const balance_2 = await clients[1].nft.balance(contract721)
      expect(balance_2).to.be.equal(1)

      // return back to initial owner
      await clients[1].nft.transfer(contract721, address_1, [1])
      await new Promise((resolve) => setTimeout(resolve, 30000))
    }).timeout(120000)

    it('Should transfer nfts ERC1155', async () => {
      const tx1155 = await clients[0].nft.transfer(contract1155, address_2, [2, 8], [1, 1])
      expect(tx1155).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      const balance_1 = await clients[0].nft.balance(contract1155, [2, 8, 51])
      expect(balance_1).to.be.an('array')
      expect(balance_1).to.deep.equal([0, 0, 1])
      const balance_2 = await clients[1].nft.balance(contract1155, [2, 8, 51])
      expect(balance_2).to.be.an('array')
      expect(balance_2).to.deep.equal([1, 1, 0])

      // return back to initial owner
      await clients[1].nft.transfer(contract1155, address_1, [2, 8], [1, 1])
      await new Promise((resolve) => setTimeout(resolve, 30000))
    }).timeout(120000)
  })

  describe('approve', () => {
    it('Should approve a single nft ERC721', async () => {
      const tx721 = await clients[0].nft.approve(contract721, address_2, 2)
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      const address = await clients[0].nft.isApproved(contract721, 2)
      expect(address).to.be.equal(address_2)

      // remove approval
      await clients[0].nft.approve(contract721, '0x0000000000000000000000000000000000000000', 2)
      await new Promise((resolve) => setTimeout(resolve, 30000))
    }).timeout(120000)

    it('Should approve multiple nfts ERC721', async () => {
      let tx721 = await clients[0].nft.approveAll(contract721, address_2)
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      let state = await clients[0].nft.isApprovedForAll(contract721, address_2)
      expect(state).to.deep.equal(true)

      // remove approval
      tx721 = await clients[0].nft.approveAll(contract721, address_2, false)
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      state = await clients[0].nft.isApprovedForAll(contract721, address_2)
      expect(state).to.deep.equal(false)
    }).timeout(120000)

    it('Should approve multiple nfts ERC1155', async () => {
      let tx721 = await clients[0].nft.approveAll(contract1155, address_2)
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      let state = await clients[0].nft.isApprovedForAll(contract1155, address_2)
      expect(state).to.deep.equal(true)

      // remove approval
      tx721 = await clients[0].nft.approveAll(contract1155, address_2, false)
      expect(tx721).to.have.deep.property('hash')

      await new Promise((resolve) => setTimeout(resolve, 30000))

      state = await clients[0].nft.isApprovedForAll(contract1155, address_2)
      expect(state).to.deep.equal(false)
    }).timeout(120000)
  })
})
