/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai

const { providers: { ethereum: { EthereumSwapProvider } } } = require('../')

const lib = new EthereumSwapProvider()

describe('Ethereum Swap provider', () => {
  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        255))
        .to.equal('607180600b6000396000f36020806000803760218160008060026048f17f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e602151141660435760ff4211605a57005b735acbf79d0cf4139a6c3eca85b41ce2bd23ced04fff5b730a81e8be41b21f651a71aab1a85c6813b8bbccf8ff')
    })

    it('should generate correct bytecode with different expiration length', () => {
      return expect(lib.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519))
        .to.equal('607380600b6000396000f36020806000803760218160008060026048f17f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e6021511416604557625bce074211605c57005b735acbf79d0cf4139a6c3eca85b41ce2bd23ced04fff5b730a81e8be41b21f651a71aab1a85c6813b8bbccf8ff')
    })
  })

  describe('Redeem swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getRedeemSwapData('01020304050607080900'))
        .to.equal('0000000000000000000000000000000000000000000001020304050607080900')
    })
  })

  describe('Refund swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getRefundSwapData())
        .to.equal('')
    })
  })
})
