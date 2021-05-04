/* eslint-env mocha */
import { expect } from 'chai'
import { hashPersonalMessage, fromRpcSig, ecrecover, publicToAddress } from 'ethereumjs-util'
import { EthereumNetworks } from '../../../ethereum-networks/lib'
import { EthereumJsWalletProvider } from '../../lib'

const MNEMONIC = 'number legend weasel whip trip silent victory taste hawk battle define file'

describe('Ethereum Js Wallet Provider', () => {
  describe('sign', () => {
    it('should return valid sig', async () => {
      const provider = new EthereumJsWalletProvider({
        network: EthereumNetworks.ethereum_mainnet,
        mnemonic: MNEMONIC,
        derivationPath: `m/44'/${EthereumNetworks.ethereum_mainnet.coinType}'/0'/0/0`
      })
      const msg = 'bitcoin'
      const addresses = await provider.getAddresses()
      const sig = await provider.signMessage(msg)
      const msgHash = hashPersonalMessage(Buffer.from(msg))
      const sigObj = fromRpcSig(`0x${sig}`)
      const publicKey = ecrecover(msgHash, sigObj.v, sigObj.r, sigObj.s)
      expect(addresses[0].address).to.equal(publicToAddress(publicKey).toString('hex'))
      expect(addresses[0].publicKey).to.equal(publicKey.toString('hex'))
    })
  })
})
