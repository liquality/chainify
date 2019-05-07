/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains, metaMaskConnector } from './common'
import config from './config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

describe('Secret generation', function () {
  this.timeout(config.timeout)
  describe('Secrets with same message differ on different wallets', () => {
    it('Nodes', async () => {
      const message = 'message'
      const ethSecret = await chains.ethereumWithNode.client.swap.generateSecret(message)
      const btcSecret = await chains.bitcoinWithNode.client.swap.generateSecret(message)
      expect(ethSecret).to.not.be.equal(btcSecret)
    })

    it('Metamask + Ledger', async () => {
      console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
      await metaMaskConnector.start()
      const message = 'message'
      const ethSecret = await chains.ethereumWithMetaMask.client.swap.generateSecret(message)
      const btcSecret = await chains.bitcoinWithLedger.client.swap.generateSecret(message)
      expect(ethSecret).to.not.be.equal(btcSecret)
      return metaMaskConnector.stop()
    })
  })
})
