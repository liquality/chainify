/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains, TEST_TIMEOUT } from '../common'
import { testTransaction } from './common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

describe('Transactions', function () {
  this.timeout(TEST_TIMEOUT)

  describe('Cosmos - Js', () => {
    testTransaction(chains.cosmosWithJs)
  })
})
