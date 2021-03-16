/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as crypto from '../../../packages/crypto/lib'
import { keccak256 } from 'ethereumjs-util'
import { chains, deployERC20Token, mineBlock, getSwapParams } from '../common'
import EthereumErc20SwapProvider from '../../../packages/ethereum-erc20-swap-provider/lib'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

const CLAIM_TOPIC = keccak256(Buffer.from('Claim(bytes32)', 'utf-8')).toString('hex')
const REFUND_TOPIC = keccak256(Buffer.from('Refund()', 'utf-8')).toString('hex')

async function createContract (chain, swapParams, secretHash) {
  const swapScript = await chain.client.getMethod('createSwapScript')(swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration)
  const initiationTx = await chain.client.chain.sendTransaction(null, swapParams.value, swapScript)
  await mineBlock(chain)
  const initiationTxReceipt = await chain.client.getMethod('getTransactionReceipt')(initiationTx.hash)
  const contractAddress = initiationTxReceipt.contractAddress
  return contractAddress
}

describe('Ethereum Contract', function () {
  this.timeout(config.timeout)

  const chain = chains.ethereumWithNode
  it('should emit claim event and secret', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const contractAddress = await createContract(chain, swapParams, secretHash)

    const claimTx = await chain.client.chain.sendTransaction(contractAddress, 0, secret)
    await mineBlock(chain)
    const claimTxReceipt = await chain.client.getMethod('getTransactionReceipt')(claimTx.hash)

    expect(claimTxReceipt.logs[0].topics[0]).to.equal(CLAIM_TOPIC)
    expect(claimTxReceipt.logs[0].data).to.equal(secret)
    expect(claimTxReceipt.logs[0].address).to.equal(contractAddress)
  })

  it('should emit refund event', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, swapParams, secretHash)

    const refundTx = await chain.client.chain.sendTransaction(contractAddress, 0, '')
    await mineBlock(chain)
    const refundTxReceipt = await chain.client.getMethod('getTransactionReceipt')(refundTx.hash)

    expect(refundTxReceipt.logs[0].topics[0]).to.equal(REFUND_TOPIC)
    expect(refundTxReceipt.logs[0].address).to.equal(contractAddress)
  })

  it('claim fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const contractAddress = await createContract(chain, swapParams, secretHash)

    await expect(chain.client.chain.sendTransaction(contractAddress, 0, secret + '66')).to.be.rejected
  })

  it('refund fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, swapParams, secretHash)

    await expect(chain.client.chain.sendTransaction(contractAddress, 0, '66')).to.be.rejected
  })
})

describe('ERC20 Contract', function () {
  this.timeout(config.timeout)

  before(async function () {
    await deployERC20Token(chains.erc20WithNode)
  })

  const chain = chains.erc20WithNode

  it('should emit claim event and secret', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const contractAddress = await createContract(chain, { ...swapParams, value: 0 }, secretHash)

    await chain.client.chain.sendTransaction(contractAddress, swapParams.value, undefined)
    await mineBlock(chain)

    const input = EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION + secret
    const claimTx = await chain.client.chain.sendTransaction(contractAddress, 0, input)
    await mineBlock(chain)
    const claimTxReceipt = await chain.client.getMethod('getTransactionReceipt')(claimTx.hash)

    expect(claimTxReceipt.logs[1].topics[0]).to.equal(CLAIM_TOPIC)
    expect(claimTxReceipt.logs[1].data).to.equal(secret)
    expect(claimTxReceipt.logs[1].address).to.equal(contractAddress)
  })

  it('should emit refund event', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, { ...swapParams, value: 0 }, secretHash)

    await chain.client.chain.sendTransaction(contractAddress, swapParams.value, undefined)
    await mineBlock(chain)

    const refundTx = await chain.client.chain.sendTransaction(contractAddress, 0, EthereumErc20SwapProvider.SOL_REFUND_FUNCTION)
    await mineBlock(chain)
    const refundTxReceipt = await chain.client.getMethod('getTransactionReceipt')(refundTx.hash)

    expect(refundTxReceipt.logs[1].topics[0]).to.equal(REFUND_TOPIC)
    expect(refundTxReceipt.logs[1].address).to.equal(contractAddress)
  })

  it('claim fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const contractAddress = await createContract(chain, { ...swapParams, value: 0 }, secretHash)

    await chain.client.chain.sendTransaction(contractAddress, swapParams.value, undefined)
    await mineBlock(chain)

    const input = EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION + secret + '66'
    await expect(chain.client.chain.sendTransaction(contractAddress, 0, input)).to.be.rejected
  })

  it('refund fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, { ...swapParams, value: 0 }, secretHash)

    await chain.client.chain.sendTransaction(contractAddress, swapParams.value, undefined)
    await mineBlock(chain)
    await expect(chain.client.chain.sendTransaction(contractAddress, 0, EthereumErc20SwapProvider.SOL_REFUND_FUNCTION + '66')).to.be.rejected
  })
})
