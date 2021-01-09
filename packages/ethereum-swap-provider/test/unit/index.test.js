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
        .to.equal('607580600b6000396000f36020806000803760218160008060026048f17f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e60215114166047576400000000ff4211605e57fe5b735acbf79d0cf4139a6c3eca85b41ce2bd23ced04fff5b730a81e8be41b21f651a71aab1a85c6813b8bbccf8ff')
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
