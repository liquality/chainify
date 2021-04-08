/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as crypto from '../../../packages/crypto/lib'
import { keccak256 } from 'ethereumjs-util'
import { TEST_TIMEOUT, chains, deployERC20Token, mineBlock, getSwapParams, Chain } from '../common'
import EthereumErc20SwapProvider from '../../../packages/ethereum-erc20-swap-provider/lib'
import { SwapParams, BigNumber } from '../../../packages/types/lib'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

const CLAIM_TOPIC = keccak256(Buffer.from('Claim(bytes32)', 'utf-8')).toString('hex')
const REFUND_TOPIC = keccak256(Buffer.from('Refund()', 'utf-8')).toString('hex')

async function createContract (chain: Chain, swapParams: SwapParams) {
  const swapScript = await chain.client.getMethod('createSwapScript')({ ...swapParams, value: new BigNumber(111) }) // Avoid value validation for ERC20
  const initiationTx = await chain.client.chain.sendTransaction({ to: null, value: swapParams.value, data: swapScript })
  await mineBlock(chain)
  const initiationTxReceipt = await chain.client.getMethod('getTransactionReceipt')(initiationTx.hash)
  const contractAddress = initiationTxReceipt.contractAddress
  return contractAddress
}

describe('Ethereum Contract', function () {
  this.timeout(TEST_TIMEOUT)

  const chain = chains.ethereumWithNode
  it('should emit claim event and secret', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const contractAddress = await createContract(chain, swapParams)

    const claimTx = await chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: secret })
    await mineBlock(chain)
    const claimTxReceipt = await chain.client.getMethod('getTransactionReceipt')(claimTx.hash)

    expect(claimTxReceipt.logs[0].topics[0]).to.equal(`0x${CLAIM_TOPIC}`)
    expect(claimTxReceipt.logs[0].data).to.equal(`0x${secret}`)
    expect(claimTxReceipt.logs[0].address).to.equal(contractAddress)
  })

  it('should emit refund event', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, swapParams)

    const refundTx = await chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: '' })
    await mineBlock(chain)
    const refundTxReceipt = await chain.client.getMethod('getTransactionReceipt')(refundTx.hash)

    expect(refundTxReceipt.logs[0].topics[0]).to.equal(`0x${REFUND_TOPIC}`)
    expect(refundTxReceipt.logs[0].address).to.equal(contractAddress)
  })

  it('claim fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const contractAddress = await createContract(chain, swapParams)

    await expect(chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: secret + '66' })).to.be.rejected
  })

  it('refund fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, swapParams)

    await expect(chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: '66' })).to.be.rejected
  })
})

describe('ERC20 Contract', function () {
  this.timeout(TEST_TIMEOUT)

  before(async function () {
    await deployERC20Token(chains.erc20WithNode)
  })

  const chain = chains.erc20WithNode

  it('should emit claim event and secret', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const contractAddress = await createContract(chain, { ...swapParams, value: new BigNumber(0) })

    await chain.client.chain.sendTransaction({ to: contractAddress, value: swapParams.value })
    await mineBlock(chain)

    const input = EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION + secret
    const claimTx = await chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: input })
    await mineBlock(chain)
    const claimTxReceipt = await chain.client.getMethod('getTransactionReceipt')(claimTx.hash)

    expect(claimTxReceipt.logs[1].topics[0]).to.equal(`0x${CLAIM_TOPIC}`)
    expect(claimTxReceipt.logs[1].data).to.equal(`0x${secret}`)
    expect(claimTxReceipt.logs[1].address).to.equal(contractAddress)
  })

  it('should emit refund event', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, { ...swapParams, value: new BigNumber(0) })
    
    await chain.client.chain.sendTransaction({ to: contractAddress, value: swapParams.value })
    await mineBlock(chain)

    const refundTx = await chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: EthereumErc20SwapProvider.SOL_REFUND_FUNCTION })
    await mineBlock(chain)
    const refundTxReceipt = await chain.client.getMethod('getTransactionReceipt')(refundTx.hash)

    expect(refundTxReceipt.logs[1].topics[0]).to.equal(`0x${REFUND_TOPIC}`)
    expect(refundTxReceipt.logs[1].address).to.equal(contractAddress)
  })

  it('claim fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const contractAddress = await createContract(chain, { ...swapParams, value: new BigNumber(0) })

    await chain.client.chain.sendTransaction({ to: contractAddress, value: swapParams.value })
    await mineBlock(chain)

    const input = EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION + secret + '66'
    await expect(chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: input })).to.be.rejected
  })

  it('refund fails with extra bytes', async () => {
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = 1000000000 // Already expired
    const contractAddress = await createContract(chain, { ...swapParams, value: new BigNumber(0) })

    await chain.client.chain.sendTransaction({ to: contractAddress, value: swapParams.value })
    await mineBlock(chain)
    await expect(chain.client.chain.sendTransaction({ to: contractAddress, value: new BigNumber(0), data: EthereumErc20SwapProvider.SOL_REFUND_FUNCTION + '66' })).to.be.rejected
  })
})
