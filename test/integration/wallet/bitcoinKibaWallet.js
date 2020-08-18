/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as bitcoin from 'bitcoinjs-lib'
import { hash160 } from '../../../packages/crypto/lib'
import { calculateFee } from '../../../packages/bitcoin-utils/lib'
import { addressToString } from '../../../packages/utils/lib'
import { chains, connectKiba, sleep, describeExternal } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

// To run bitcoinWithKiba tests create a testnetConfig.js with testnetHost, testnetUsername, testnetConfig, testnetApi, testnetNetwork
function testWallet (chain) {
  describe('getUnusedAddress', () => {
    it('should change unusedAddress when funds are sent to it', async () => {
      const { address: unusedAddressOne } = await chain.client.wallet.getUnusedAddress()

      const value = 100000

      const rawSendTransaction = await chain.client.chain.buildTransaction(unusedAddressOne, value)
      await chain.client.getMethod('sendRawTransaction')(rawSendTransaction)

      await sleep(1000)

      const { address: unusedAddressTwo } = await chain.client.wallet.getUnusedAddress()

      expect(unusedAddressOne).to.not.equal(unusedAddressTwo)
    })
  })

  describe('getUsedAddresses', () => {
    it('should include address recently sent funds to in array', async () => {
      const { address: expectedAddress } = await chain.client.wallet.getUnusedAddress()

      const value = 100000

      const rawSendTransaction = await chain.client.chain.buildTransaction(expectedAddress, value)
      await chain.client.getMethod('sendRawTransaction')(rawSendTransaction)

      await sleep(1000)

      const usedAddresses = await chain.client.wallet.getUsedAddresses()

      const { address: actualAddress } = usedAddresses[usedAddresses.length - 1]

      expect(expectedAddress).to.equal(actualAddress)
    })
  })

  describe('getAddresses', () => {
    it('should properly get addresses in order', async () => {
      const { address: firstAddress } = (await chain.client.wallet.getAddresses(0, 2))[1]

      const { address: secondAddress } = (await chain.client.wallet.getAddresses(1, 1))[0]

      expect(firstAddress).to.equal(secondAddress)
    })
  })

  describe('signMessage', () => {
    it('should return hex of signed message', async () => {
      const addresses = await chain.client.wallet.getAddresses(0, 1)
      const { address } = addresses[0]

      const signedMessage = await chain.client.wallet.signMessage('secret', address)

      const signedMessageBuffer = Buffer.from(signedMessage, 'hex')

      expect(signedMessage).to.equal(signedMessageBuffer.toString('hex'))
    })

    it('should return the same hex if signed twice', async () => {
      const addresses = await chain.client.wallet.getAddresses(0, 1)
      const { address } = addresses[0]

      const signedMessage1 = await chain.client.wallet.signMessage('secret', address)
      const signedMessage2 = await chain.client.wallet.signMessage('secret', address)

      expect(signedMessage1).to.equal(signedMessage2)
    })
  })

  describe('buildTransaction', () => {
    it('should build transaction with one output', async () => {
      const unusedAddress = await chain.client.wallet.getUnusedAddress()
      const { address } = unusedAddress

      const rawTx = await chain.client.getMethod('buildTransaction')(address, 50000)

      const tx = await chain.client.getMethod('decodeRawTransaction')(rawTx)

      const vouts = tx._raw.vout
      const vins = tx._raw.vin

      expect(vins.length).to.equal(1)
      expect(vouts.length).to.equal(1)
    })
  })

  describe('buildBatchTransaction', () => {
    it('should build transaction with two outputs', async () => {
      const { address: address1 } = await chain.client.wallet.getUnusedAddress()
      const { address: address2 } = (await chain.client.wallet.getUsedAddresses())[0]

      const value = 50000

      const rawTx = await chain.client.chain.buildBatchTransaction([{ to: address1, value }, { to: address2, value }])

      const tx = await chain.client.getMethod('decodeRawTransaction')(rawTx)

      const vouts = tx._raw.vout
      const vins = tx._raw.vin

      expect(vins.length).to.equal(1)
      expect(vouts.length).to.equal(3)
    })

    it('should successfully create op_return tx', async () => {
      const { address: address1 } = await chain.client.wallet.getUnusedAddress()

      const data = Buffer.from(
        `test`,
        'utf8'
      )
      const dataScript = bitcoin.payments.embed({ data: [data] })

      const value = 50000

      const rawTx = await chain.client.chain.buildBatchTransaction([{ to: address1, value }, { to: dataScript.output, value: 0 }])

      const tx = await chain.client.getMethod('decodeRawTransaction')(rawTx)

      const vouts = tx._raw.vout
      const vins = tx._raw.vin

      expect(vins.length).to.equal(1)
      expect(vouts.length).to.equal(3)
    })
  })

  describe('getConnectedNetwork', () => {
    it('should return bitcoin_testnet', async () => {
      const network = await chain.client.getMethod('getConnectedNetwork')()

      expect(network.name).to.equal('bitcoin_testnet')
    })
  })

  describe('signP2SHTransaction', () => {
    it('should redeem one P2SH', async () => {
      const network = chain.network
      const value = 50000
      const OPS = bitcoin.script.OPS

      const { address: unusedAddressTwo } = (await chain.client.wallet.getUsedAddresses())[0]

      const { address: unusedAddressOne } = await chain.client.wallet.getUnusedAddress()

      const newAddresses = [ unusedAddressOne ]

      let addresses = []
      for (const newAddress of newAddresses) {
        const address = await chain.client.getMethod('getWalletAddress')(newAddress)
        addresses.push(address)
      }

      const multisigOutput = bitcoin.script.compile([
        OPS.OP_DUP,
        OPS.OP_HASH160,
        Buffer.from(hash160(addresses[0].publicKey), 'hex'),
        OPS.OP_EQUALVERIFY,
        OPS.OP_CHECKSIG
      ])

      const paymentVariant = bitcoin.payments.p2wsh({ redeem: { output: multisigOutput, network }, network })

      const address = paymentVariant.address

      const initiationTxHash = await chain.client.chain.sendTransaction(address, value)

      await sleep(1000)

      const initiationTxRaw = await chain.client.getMethod('getRawTransactionByHash')(initiationTxHash)
      const initiationTx = await chain.client.getMethod('decodeRawTransaction')(initiationTxRaw)

      const multiOne = {}

      for (const voutIndex in initiationTx._raw.vout) {
        const vout = initiationTx._raw.vout[voutIndex]
        const paymentVariantEntryOne = (paymentVariant.output.toString('hex') === vout.scriptPubKey.hex)
        if (paymentVariantEntryOne) multiOne.multiVout = vout
      }

      const txb = new bitcoin.TransactionBuilder(network)
      const txfee = calculateFee(3, 3, 9)

      multiOne.multiVout.vSat = value

      txb.addInput(initiationTxHash, multiOne.multiVout.n, 0, paymentVariant.output)
      txb.addOutput(addressToString(unusedAddressTwo), value - txfee)

      const tx = txb.buildIncomplete()

      const signaturesOne = await chain.client.getMethod('signP2SHTransaction')(initiationTxRaw, tx, addresses[0].address, multiOne.multiVout, paymentVariant.redeem.output, 0, true)

      const multiOneInput = bitcoin.script.compile([
        Buffer.isBuffer(signaturesOne) ? signaturesOne : Buffer.from(signaturesOne, 'hex'),
        Buffer.isBuffer(addresses[0].publicKey) ? addresses[0].publicKey : Buffer.from(addresses[0].publicKey, 'hex')
      ])

      multiOne.paymentParams = { redeem: { output: multisigOutput, input: multiOneInput, network }, network }

      multiOne.paymentWithInput = bitcoin.payments.p2wsh(multiOne.paymentParams)

      tx.setWitness(0, multiOne.paymentWithInput.witness)

      const claimTxHash = await chain.client.getMethod('sendRawTransaction')(tx.toHex())

      const claimTxRaw = await chain.client.getMethod('getRawTransactionByHash')(claimTxHash)
      const claimTx = await chain.client.getMethod('decodeRawTransaction')(claimTxRaw)

      const claimVouts = claimTx._raw.vout
      const claimVins = claimTx._raw.vin

      expect(claimVins.length).to.equal(1)
      expect(claimVouts.length).to.equal(1)
    })
  })

  describe('signBatchP2SHTransaction', () => {
    it('should redeem two P2SH\'s', async () => {
      const network = chain.network
      const value = 50000
      const OPS = bitcoin.script.OPS

      const { address: unusedAddressTwo } = (await chain.client.wallet.getUsedAddresses())[0]

      const { address: unusedAddressOne } = await chain.client.wallet.getUnusedAddress()

      const newAddresses = [ unusedAddressOne, unusedAddressTwo ]

      let addresses = []
      for (const newAddress of newAddresses) {
        const address = await chain.client.getMethod('getWalletAddress')(newAddress)
        addresses.push(address)
      }

      const multisigOutputOne = bitcoin.script.compile([
        OPS.OP_2,
        Buffer.isBuffer(addresses[0].publicKey) ? addresses[0].publicKey : Buffer.from(addresses[0].publicKey, 'hex'),
        Buffer.isBuffer(addresses[1].publicKey) ? addresses[1].publicKey : Buffer.from(addresses[1].publicKey, 'hex'),
        OPS.OP_2,
        OPS.OP_CHECKMULTISIG
      ])

      const multisigOutputTwo = bitcoin.script.compile([
        OPS.OP_2,
        Buffer.isBuffer(addresses[1].publicKey) ? addresses[1].publicKey : Buffer.from(addresses[1].publicKey, 'hex'),
        Buffer.isBuffer(addresses[0].publicKey) ? addresses[0].publicKey : Buffer.from(addresses[0].publicKey, 'hex'),
        OPS.OP_2,
        OPS.OP_CHECKMULTISIG
      ])

      const paymentVariantOne = bitcoin.payments.p2wsh({ redeem: { output: multisigOutputOne, network }, network })
      const paymentVariantTwo = bitcoin.payments.p2wsh({ redeem: { output: multisigOutputTwo, network }, network })

      const addressOne = paymentVariantOne.address
      const addressTwo = paymentVariantTwo.address

      const initiationTxHash = await chain.client.chain.sendBatchTransaction([{ to: addressOne, value }, { to: addressTwo, value }])

      await sleep(2000)

      const initiationTxRaw = await chain.client.getMethod('getRawTransactionByHash')(initiationTxHash)
      const initiationTx = await chain.client.getMethod('decodeRawTransaction')(initiationTxRaw)

      const multiOne = {}
      const multiTwo = {}

      for (const voutIndex in initiationTx._raw.vout) {
        const vout = initiationTx._raw.vout[voutIndex]
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
        Buffer.isBuffer(signaturesOne[0]) ? signaturesOne[0] : Buffer.from(signaturesOne[0], 'hex'),
        Buffer.isBuffer(signaturesTwo[0]) ? signaturesTwo[0] : Buffer.from(signaturesTwo[0], 'hex')
      ])

      const multiTwoInput = bitcoin.script.compile([
        OPS.OP_0,
        Buffer.isBuffer(signaturesTwo[1]) ? signaturesTwo[1] : Buffer.from(signaturesTwo[1], 'hex'),
        Buffer.isBuffer(signaturesOne[1]) ? signaturesOne[1] : Buffer.from(signaturesOne[1], 'hex')
      ])

      multiOne.paymentParams = { redeem: { output: multisigOutputOne, input: multiOneInput, network }, network }
      multiTwo.paymentParams = { redeem: { output: multisigOutputTwo, input: multiTwoInput, network }, network }

      multiOne.paymentWithInput = bitcoin.payments.p2wsh(multiOne.paymentParams)
      multiTwo.paymentWithInput = bitcoin.payments.p2wsh(multiTwo.paymentParams)

      tx.setWitness(0, multiOne.paymentWithInput.witness)
      tx.setWitness(1, multiTwo.paymentWithInput.witness)

      const claimTxHash = await chain.client.getMethod('sendRawTransaction')(tx.toHex())

      await sleep(2000)

      const claimTxRaw = await chain.client.getMethod('getRawTransactionByHash')(claimTxHash)
      const claimTx = await chain.client.getMethod('decodeRawTransaction')(claimTxRaw)

      const claimVouts = claimTx._raw.vout
      const claimVins = claimTx._raw.vin

      expect(claimVins.length).to.equal(2)
      expect(claimVouts.length).to.equal(1)
    })
  })
}

describe.skip('Wallet Interaction', function () {
  this.timeout(config.timeout)

  describeExternal('Bitcoin - Kiba', () => {
    connectKiba()

    testWallet(chains.bitcoinWithKiba)
  })
})
