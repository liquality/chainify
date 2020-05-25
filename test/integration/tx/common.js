/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { getRandomAddress, mineBlock, expectFee } from '../common'
import config from '../config'

function testTransaction (chain) {
  it('Sent value to 1 address', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    await chain.client.chain.sendTransaction(addr, value)
    await mineBlock(chain)
    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })

  it('Send transaction with fee', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    const txHash = await chain.client.chain.sendTransaction(addr, value, undefined, 100)
    await mineBlock(chain)

    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
    await expectFee(chain, txHash, 100)
  })

  ;(chain.client.wallet.canUpdateFee ? it : it.skip)('Update transaction fee', async () => {
    const addr = await getRandomAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    const txHash = await chain.client.chain.sendTransaction(addr, value, undefined, 100)
    await expectFee(chain, txHash, 100)
    const newTxHash = await chain.client.chain.updateTransactionFee(txHash, 120)
    await expect(newTxHash).to.not.equal(txHash)
    await expectFee(chain, newTxHash, 120)
    await mineBlock(chain)

    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
}

export {
  testTransaction
}
