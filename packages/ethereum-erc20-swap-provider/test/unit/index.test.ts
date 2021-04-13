/* eslint-env mocha */

import { BigNumber } from '../../../types/lib'
import EthereumErc20SwapProvider from '../../lib'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Ethereum ERC20 Swap provider', () => {
  let provider: EthereumErc20SwapProvider

  beforeEach(() => {
    provider = new EthereumErc20SwapProvider()
    // @ts-ignore
    provider.setClient({
      getMethod(name: string) {
        if (name === 'getContractAddress') {
          return () => '89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'
        } else {
          throw new Error('method not mocked')
        }
      }
    })
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider.createSwapScript({
          value: new BigNumber(111),
          recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
          refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
          secretHash: '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
          expiration: 1615566223
        })
      ).to.equal(
        '6080604052600080546001600160a01b0319908116735acbf79d0cf4139a6c3eca85b41ce2bd23ced04f17909155600180548216730a81e8be41b21f651a71aab1a85c6813b8bbccf81790556002805482167389d24a6b4ccb1b6faa2625fe562bdd9a232603591790819055600380549092166001600160a01b03919091161790557f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e6004553480156100b157600080fd5b50610555806100c16000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063590e1ae31461003b578063bd66528a14610045575b600080fd5b610043610062565b005b6100436004803603602081101561005b57600080fd5b5035610235565b6004361461006f57600080fd5b7f00000000000000000000000000000000000000000000000000000000604b958f421161009b57600080fd5b600354604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b1580156100e657600080fd5b505afa1580156100fa573d6000803e3d6000fd5b505050506040513d602081101561011057600080fd5b505190508061011e57600080fd5b600154600354604080516370a0823160e01b815230600482015290516101fe9363a9059cbb60e01b936001600160a01b03918216939116916370a0823191602480820192602092909190829003018186803b15801561017c57600080fd5b505afa158015610190573d6000803e3d6000fd5b505050506040513d60208110156101a657600080fd5b5051604080516001600160a01b0390931660248401526044808401929092528051808403909201825260649092019091526020810180516001600160e01b03166001600160e01b03199093169290921790915261040d565b6040517f5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed5517890600090a16001546001600160a01b0316ff5b6024361461024257600080fd5b600454600282604051602001808281526020019150506040516020818303038152906040526040518082805190602001908083835b602083106102965780518252601f199092019160209182019101610277565b51815160209384036101000a60001901801990921691161790526040519190930194509192505080830381855afa1580156102d5573d6000803e3d6000fd5b5050506040513d60208110156102ea57600080fd5b5051146102f657600080fd5b600354604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b15801561034157600080fd5b505afa158015610355573d6000803e3d6000fd5b505050506040513d602081101561036b57600080fd5b505190508061037957600080fd5b600054604080516001600160a01b039092166024830152604480830184905281518084039091018152606490920190526020810180516001600160e01b031663a9059cbb60e01b1790526103cc9061040d565b6040805183815290517f8c1d64e3bd87387709175b9ef4e7a1d7a8364559fc0e2ad9d77953909a0d1eb39181900360200190a16000546001600160a01b0316ff5b600061041882610446565b8051909150156104425780806020019051602081101561043757600080fd5b505161044257600080fd5b5050565b600254604051825160609260009283926001600160a01b0390921691869190819060208401908083835b6020831061048f5780518252601f199092019160209182019101610470565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146104f1576040519150601f19603f3d011682016040523d82523d6000602084013e6104f6565b606091505b5091509150811561050a57915061051a9050565b8051156100365780518082602001fd5b91905056fea2646970667358221220439a725cbd518d89b852af5b7e1c335cc4ba64e029f96f6c702b2e60fb985ba564736f6c63430007060033'
      )
    })

    describe('Swap contract address validation', () => {
      function testRecipientAddress(recipientAddress: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress,
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidAddressError')
      }

      function testRefundAddress(refundAddress: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            refundAddress,
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidAddressError')
      }

      it('should throw error with address wrong type', () => {
        // @ts-ignore
        testRecipientAddress(123)
        // @ts-ignore
        testRefundAddress(123)
      })

      it('should throw error with address wrong format', () => {
        testRecipientAddress('zzzzzzzz41b21f651a71aab1a85c6813b8bbccf8')
        testRefundAddress('zzzzzzzz41b21f651a71aab1a85c6813b8bbccf8')
      })

      it('should throw error with address too short', () => {
        testRecipientAddress('e8be41b21f651a71aab1a85c6813b8bbccf8')
        testRefundAddress('e8be41b21f651a71aab1a85c6813b8bbccf8')
      })

      it('should throw error with address too long', () => {
        testRecipientAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf888888888')
        testRefundAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf888888888')
      })
    })

    describe('Swap contract secretHash validation', () => {
      function testSecretHash(secretHash: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidSecretError')
      }

      it('should throw when secretHash too small', () => {
        testSecretHash('ffff')
      })

      it('should throw when secretHash too large', () => {
        testSecretHash('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      })

      it('should throw when secretHash not hex', () => {
        testSecretHash('OPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOP')
      })

      it('should throw error when secret hash is hash of secret 0', () => {
        testSecretHash('66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925')
      })
    })

    describe('Swap contract expiration validation', () => {
      function testExpirationInvalid(expiration: number) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration
          })
        )
          .to.throw()
          .property('name', 'InvalidExpirationError')
      }

      it('should throw error with 0 expiration', () => {
        testExpirationInvalid(0)
      })

      it('should throw error with expiration too small', () => {
        testExpirationInvalid(5000000)
      })

      it('should throw error with expiration too big', () => {
        testExpirationInvalid(1234567891234567)
      })

      it('should throw error with expiration not number', () => {
        // @ts-ignore
        testExpirationInvalid('123')
      })
    })

    describe('Swap contract secretHash validation', () => {
      it('should accept valid secretHash', () => {
        provider.createSwapScript({
          value: new BigNumber(111),
          recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
          refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
          secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          expiration: 1468194353
        })
      })

      function testSecretHash(secretHash: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidSecretError')
      }

      it('should throw when secretHash too small', () => {
        testSecretHash('ffff')
      })

      it('should throw when secretHash too large', () => {
        testSecretHash('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      })

      it('should throw when secretHash not hex', () => {
        testSecretHash('OPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOP')
      })
    })
  })
})
