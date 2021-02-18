/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import { testTransaction } from './common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

describe('Transactions', function () {
  this.timeout(config.timeout)

  describe('Near - Js', () => {
    testTransaction(chains.nearWithJs)
  })
})
