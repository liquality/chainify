/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as bitcoin from 'bitcoinjs-lib'
import { calculateFee } from '../../../packages/bitcoin-utils/lib'
import { addressToString } from '../../../packages/utils/lib'
import { chains, mineBitcoinBlocks, importBitcoinAddresses, fundUnusedBitcoinAddress } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testTransaction (chain) {
  it('Sent value to 1 address', async () => {
    const addr = (await chain.client.wallet.getUnusedAddress()).address
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    await chain.client.chain.sendTransaction(addr, value)
    await chains.bitcoinWithNode.client.chain.generateBlock(1)
    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
}

function testBatchTransaction (chain) {
  it('Sent value to 2 addresses', async () => {
    const addr1 = (await chain.client.wallet.getUnusedAddress()).address
    await fundUnusedBitcoinAddress(chain)
    const addr2 = (await chain.client.wallet.getUnusedAddress()).address

    const value = config[chain.name].value

    const bal1Before = await chain.client.chain.getBalance(addr1)
    const bal2Before = await chain.client.chain.getBalance(addr2)
    await chain.client.chain.sendBatchTransaction([{ to: addr1, value }, { to: addr2, value }])
    await chains.bitcoinWithNode.client.chain.generateBlock(1)
    const bal1After = await chain.client.chain.getBalance(addr1)
    const bal2After = await chain.client.chain.getBalance(addr2)

    expect(bal1Before.plus(value).toString()).to.equal(bal1After.toString())
    expect(bal2Before.plus(value).toString()).to.equal(bal2After.toString())
  })
}

function testSignBatchP2SHTransaction (chain) {
  it('Should redeem two P2SH\'s', async () => {
    const network = chain.network
    const value = config[chain.name].value
    const OPS = bitcoin.script.OPS

    const { address: unusedAddressOne } = await chain.client.wallet.getUnusedAddress()
    await chain.client.chain.sendTransaction(unusedAddressOne, value)
    await chains.bitcoinWithNode.client.chain.generateBlock(1)

    const { address: unusedAddressTwo } = await chain.client.wallet.getUnusedAddress()

    const newAddresses = [ unusedAddressOne, unusedAddressTwo ]

    let addresses = []
    for (const newAddress of newAddresses) {
      const address = await chain.client.getMethod('getWalletAddress')(newAddress)
      addresses.push(address)
    }

    const multisigOutputOne = bitcoin.script.compile([
      OPS.OP_2,
      Buffer.from(addresses[0].publicKey, 'hex'),
      Buffer.from(addresses[1].publicKey, 'hex'),
      OPS.OP_2,
      OPS.OP_CHECKMULTISIG
    ])

    const multisigOutputTwo = bitcoin.script.compile([
      OPS.OP_2,
      Buffer.from(addresses[1].publicKey, 'hex'),
      Buffer.from(addresses[0].publicKey, 'hex'),
      OPS.OP_2,
      OPS.OP_CHECKMULTISIG
    ])

    const paymentVariantOne = bitcoin.payments.p2wsh({ redeem: { output: multisigOutputOne, network }, network })
    const paymentVariantTwo = bitcoin.payments.p2wsh({ redeem: { output: multisigOutputTwo, network }, network })

    const addressOne = paymentVariantOne.address
    const addressTwo = paymentVariantTwo.address

    const initiationTxHash = await chain.client.chain.sendBatchTransaction([{ to: addressOne, value }, { to: addressTwo, value }])
    mineBitcoinBlocks()

    const initiationTxRaw = await chain.client.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await chain.client.getMethod('decodeRawTransaction')(initiationTxRaw)

    const multiOne = {}
    const multiTwo = {}

    for (const voutIndex in initiationTx._raw.data.vout) {
      const vout = initiationTx._raw.data.vout[voutIndex]
      const paymentVariantEntryOne = (paymentVariantOne.output.toString('hex') === vout.scriptPubKey.hex)
      const paymentVariantEntryTwo = (paymentVariantTwo.output.toString('hex') === vout.scriptPubKey.hex)
      if (paymentVariantEntryOne) multiOne.multiVout = vout
      if (paymentVariantEntryTwo) multiTwo.multiVout = vout
    }

    const txb = new bitcoin.TransactionBuilder(network)
    const txfee = calculateFee(3, 3, 9)

    multiOne.multiVout.vSat = value
    multiTwo.multiVout.vSat = value

    txb.addInput(initiationTxHash, multiOne.multiVout.n, 0, paymentVariantOne.output)
    txb.addInput(initiationTxHash, multiTwo.multiVout.n, 0, paymentVariantTwo.output)
    txb.addOutput(addressToString(unusedAddressTwo), (value * 2) - txfee)

    const tx = txb.buildIncomplete()

    const signaturesOne = await chain.client.getMethod('signBatchP2SHTransaction')(
      [
        { inputTxHex: initiationTxRaw, index: 0, vout: multiOne.multiVout, outputScript: paymentVariantOne.redeem.output },
        { inputTxHex: initiationTxRaw, index: 1, vout: multiTwo.multiVout, outputScript: paymentVariantTwo.redeem.output }
      ],
      [ addresses[0].address, addresses[0].address ],
      tx,
      0,
      true
    )

    const signaturesTwo = await chain.client.getMethod('signBatchP2SHTransaction')(
      [
        { inputTxHex: initiationTxRaw, index: 0, vout: multiOne.multiVout, outputScript: paymentVariantOne.redeem.output },
        { inputTxHex: initiationTxRaw, index: 1, vout: multiTwo.multiVout, outputScript: paymentVariantTwo.redeem.output }
      ],
      [ addresses[1].address, addresses[1].address ],
      tx,
      0,
      true
    )

    const multiOneInput = bitcoin.script.compile([
      OPS.OP_0,
      signaturesOne[0],
      signaturesTwo[0]
    ])

    const multiTwoInput = bitcoin.script.compile([
      OPS.OP_0,
      signaturesTwo[1],
      signaturesOne[1]
    ])

    multiOne.paymentParams = { redeem: { output: multisigOutputOne, input: multiOneInput, network }, network }
    multiTwo.paymentParams = { redeem: { output: multisigOutputTwo, input: multiTwoInput, network }, network }

    multiOne.paymentWithInput = bitcoin.payments.p2wsh(multiOne.paymentParams)
    multiTwo.paymentWithInput = bitcoin.payments.p2wsh(multiTwo.paymentParams)

    tx.setWitness(0, multiOne.paymentWithInput.witness)
    tx.setWitness(1, multiTwo.paymentWithInput.witness)

    const claimTxHash = await chain.client.getMethod('sendRawTransaction')(tx.toHex())

    const claimTxRaw = await chain.client.getMethod('getRawTransactionByHash')(claimTxHash)
    const claimTx = await chain.client.getMethod('decodeRawTransaction')(claimTxRaw)

    const claimVouts = claimTx._raw.data.vout
    const claimVins = claimTx._raw.data.vin

    expect(claimVins.length).to.equal(2)
    expect(claimVouts.length).to.equal(1)
  })
}

describe('Send Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Js', () => {
    before(async function () { await importBitcoinAddresses(chains.bitcoinWithJs) })
    beforeEach(async function () { await fundUnusedBitcoinAddress(chains.bitcoinWithJs) })
    testTransaction(chains.bitcoinWithJs)
  })
})

describe('Send Batch Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Node', () => {
    testBatchTransaction(chains.bitcoinWithNode)
  })

  describe('Bitcoin - Js', () => {
    before(async function () { await importBitcoinAddresses(chains.bitcoinWithJs) })
    beforeEach(async function () { await fundUnusedBitcoinAddress(chains.bitcoinWithJs) })
    testBatchTransaction(chains.bitcoinWithJs)
  })
})

describe('Sign Batch P2SH Transaction', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Node', () => {
    testSignBatchP2SHTransaction(chains.bitcoinWithNode)
  })

  describe('Bitcoin - Js', () => {
    before(async function () { await importBitcoinAddresses(chains.bitcoinWithJs) })
    beforeEach(async function () { await fundUnusedBitcoinAddress(chains.bitcoinWithJs) })
    testSignBatchP2SHTransaction(chains.bitcoinWithJs)
  })
})
