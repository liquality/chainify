/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { getRandomAddress, mineBlock, Chain, expectFee } from '../common'
import config from '../config'

function testTransaction(chain: Chain) {
  it('Sent value to 1 address', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name as keyof typeof config].value

    const balBefore = await chain.client.chain.getBalance([addr])
    await chain.client.chain.sendTransaction({ to: addr, value })
    await mineBlock(chain)

    const balAfter = await chain.client.chain.getBalance([addr])

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
  it('Send transaction with fee', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name as keyof typeof config].value
    const balBefore = await chain.client.chain.getBalance([addr])
    const tx = await chain.client.chain.sendTransaction({ to: addr, value, fee: 100 })
    await mineBlock(chain)
    const balAfter = await chain.client.chain.getBalance([addr])
    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
    await expectFee(chain, tx.hash, 100)
  })
  ;(chain.client.wallet.canUpdateFee ? it : it.skip)('Update transaction fee', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name as keyof typeof config].value
    const balBefore = await chain.client.chain.getBalance([addr])
    const tx = await chain.client.chain.sendTransaction({ to: addr, value, fee: 100 })
    await expectFee(chain, tx.hash, 100)
    const newTx = await chain.client.chain.updateTransactionFee(tx.hash, 120)
    await expect(newTx.hash).to.not.equal(tx.hash)
    await expectFee(chain, newTx.hash, 120)
    await mineBlock(chain)
    const balAfter = await chain.client.chain.getBalance([addr])
    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
}

export { testTransaction }
