/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Chain, chains, TEST_TIMEOUT, mineBlock } from '../common'
import { testTransaction } from './common'
import config from '../config'
import { BigNumber, cosmos } from '../../../packages/types/lib'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

describe('Transactions', function () {
  this.timeout(TEST_TIMEOUT)

  describe('Cosmos - Js', () => {
    testTransaction(chains.cosmosWithJs)
    testStaking(chains.cosmosWithJs)
  })
})

function testStaking(chain: Chain) {
  it('Delegate uphoton to validator', async () => {
    const amount = config['cosmos'].value
    const delegatorAddr = config['cosmos'].senderAddress
    const validatorAddr = config['cosmos'].validatorAddress

    const balBefore = await chain.client.getMethod('getDelegatedAmount')(delegatorAddr, validatorAddr)

    await chain.client.chain.sendTransaction({
      type: cosmos.MsgType.MsgDelegate,
      to: validatorAddr,
      value: amount
    } as cosmos.CosmosSendOptions)
    await mineBlock(chain)

    const balAfter = await chain.client.getMethod('getDelegatedAmount')(delegatorAddr, validatorAddr)

    expect(new BigNumber(balBefore.amount).plus(amount).toString()).to.equal(balAfter.amount)
  })
}
