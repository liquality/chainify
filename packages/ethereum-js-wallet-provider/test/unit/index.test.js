/* eslint-env mocha */
import { expect } from 'chai'
import * as ethUtil from 'ethereumjs-util'
import EthereumNetworks from '../../../ethereum-networks/lib'
import EthereumJsWalletProvider from '../../lib'

const MNEMONIC = 'number legend weasel whip trip silent victory taste hawk battle define file'

describe('Ethereum Js Wallet Provider', () => {
  describe('sign', () => {
    it('should return valid sig', async () => {
      const provider = new EthereumJsWalletProvider(EthereumNetworks.mainnet, MNEMONIC)
      const msg = 'bitcoin'
      const addresses = await provider.getAddresses()
      const sig = await provider.signMessage(msg)
      const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg))
      const sigObj = ethUtil.fromRpcSig(`0x${sig}`)
      const publicKey = ethUtil.ecrecover(msgHash, sigObj.v, sigObj.r, sigObj.s)
      expect(addresses[0].address).to.equal(ethUtil.publicToAddress(publicKey).toString('hex'))
      expect(addresses[0].publicKey.toString('hex')).to.equal(publicKey.toString('hex'))
    })
  })
})
