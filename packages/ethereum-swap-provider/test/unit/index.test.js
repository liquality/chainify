/* eslint-env mocha */

import EthereumSwapProvider from '../../lib'

const { expect } = require('chai').use(require('chai-as-promised'))

describe('Ethereum Swap provider', () => {
  let provider

  beforeEach(() => {
    provider = new EthereumSwapProvider()
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        255))
        .to.equal('60c880600b6000396000f36020806000803760218160008060026048f136602014167f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e6021511416604f5736156400000000ff421116608c57fe5b7f8c1d64e3bd87387709175b9ef4e7a1d7a8364559fc0e2ad9d77953909a0d1eb360206000a1735acbf79d0cf4139a6c3eca85b41ce2bd23ced04fff5b7f5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed55178600080a1730a81e8be41b21f651a71aab1a85c6813b8bbccf8ff')
    })

    it('should throw error when recipient address too long', () => {
      return expect(() => provider.createSwapScript('13375acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519))
        .to.throw()
    })

    it('should throw error when recipient address too short', () => {
      return expect(() => provider.createSwapScript('39a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519))
        .to.throw()
    })

    it('should throw error when refund address too long', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '13370a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519))
        .to.throw()
    })

    it('should throw error when refund address too short', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519))
        .to.throw()
    })

    it('should throw error when secret hash longer than 32 bytes', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e13371337',
        6016519))
        .to.throw()
    })

    it('should throw error when secret hash shorter than 32 bytes', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386',
        6016519))
        .to.throw()
    })

    it('should throw error when secret hash is hash of secret 0', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925',
        6016519))
        .to.throw()
    })

    it('should throw error when expiration too large', () => {
      return expect(() => provider.createSwapScript('5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
        '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
        '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
        6016519819834567129))
        .to.throw()
    })
  })
})
