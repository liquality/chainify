/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains, metaMaskConnector, describeExternal, TEST_TIMEOUT } from '../common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

describe('Secret generation', function () {
  this.timeout(TEST_TIMEOUT)
  describe('Secret is the same when generated multiple times', () => {
    it('Bitcoin Node', async () => {
      const message = 'message'
      const secret1 = await chains.bitcoinWithNode.client.swap.generateSecret(message)
      const secret2 = await chains.bitcoinWithNode.client.swap.generateSecret(message)
      expect(secret1).to.be.equal(secret2)
    })

    it('Near JS', async () => {
      const message = 'message'
      const secret1 = await chains.nearWithJs.client.swap.generateSecret(message)
      const secret2 = await chains.nearWithJs.client.swap.generateSecret(message)
      expect(secret1).to.be.equal(secret2)
    })
  })

  describeExternal('Metamask + Ledger', () => {
    it('Secrets with same message differ on different wallets', async () => {
      console.log(
        '\x1b[36m',
        'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue',
        '\x1b[0m'
      )
      await metaMaskConnector.start()
      const message = 'message'
      const ethSecret = await chains.ethereumWithMetaMask.client.swap.generateSecret(message)
      const btcSecret = await chains.bitcoinWithLedger.client.swap.generateSecret(message)
      expect(ethSecret).to.not.be.equal(btcSecret)
      return metaMaskConnector.stop()
    })
  })
})
