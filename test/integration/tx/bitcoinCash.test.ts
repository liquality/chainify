/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as bitcoinJs from 'bitcoinjs-lib'
import { BigNumber } from '../../../packages/types/lib'
import * as BitcoinCashUtils from '../../../packages/bitcoin-cash-utils/lib'
import {
  TEST_TIMEOUT,
  Chain,
  chains,
  importBitcoinAddresses,
  getNewAddress,
  getRandomBitcoinCashAddress,
  mineBlock,
  fundWallet
} from '../common'
import { testTransaction } from './common'
import config from '../config'
import { BitcoinCashNetwork } from '../../../packages/bitcoin-cash-networks/lib'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

function testBatchTransaction(chain: Chain) {
  it('Sent value to 2 addresses', async () => {
    const addr1 = await getRandomBitcoinCashAddress(chain)
    const addr2 = await getRandomBitcoinCashAddress(chain)

    const value = config[chain.name as keyof typeof config].value

    const bal1Before = await chain.client.chain.getBalance([addr1])
    const bal2Before = await chain.client.chain.getBalance([addr2])
    await chain.client.chain.sendBatchTransaction([
      { to: addr1, value },
      { to: addr2, value }
    ])
    await mineBlock(chain)
    const bal1After = await chain.client.chain.getBalance([addr1])
    const bal2After = await chain.client.chain.getBalance([addr2])

    expect(bal1Before.plus(value).toString()).to.equal(bal1After.toString())
    expect(bal2Before.plus(value).toString()).to.equal(bal2After.toString())
  })
}

function testSweepTransaction(chain: Chain) {
  it('should sweep wallet balance', async () => {
    await fundWallet(chains.bitcoinCashWithJs)

    const nonChangeAddresses = await chain.client.wallet.getAddresses(0, 20, false)
    const changeAddresses = await chain.client.wallet.getAddresses(0, 20, true)
    const addrList = nonChangeAddresses.concat(changeAddresses)

    const bal = (await chain.client.chain.getBalance(addrList)).toNumber()

    let sendTxChain
    if (bal === 0) {
      sendTxChain = chains.bitcoinCashWithNode
    } else {
      sendTxChain = chain
    }
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[1], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[2], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[3], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[4], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[5], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[6], value: new BigNumber(200000000) })

    const addr1 = await getRandomBitcoinCashAddress(chain)
    await chain.client.chain.sendSweepTransaction(addr1)

    const balanceAfter = await chain.client.chain.getBalance(changeAddresses)
    expect(balanceAfter.toString()).to.equal('0')
  })
}

function testSignBatchP2SHTransaction(chain: Chain) {
  it("Should redeem two P2SH's", async () => {
    const network = chain.network
    const value = config[chain.name as keyof typeof config].value
    const OPS = bitcoinJs.script.OPS

    const { address: unusedAddressOne } = await getNewAddress(chain)
    await chain.client.chain.sendTransaction({ to: unusedAddressOne, value })
    await mineBlock(chain)

    const { address: unusedAddressTwo } = await getNewAddress(chain)

    const newAddresses = [unusedAddressOne, unusedAddressTwo]

    const addresses = []
    for (const newAddress of newAddresses) {
      const address = await chain.client.getMethod('getWalletAddress')(newAddress)
      addresses.push(address)
    }

    const multisigOutputOne = bitcoinJs.script.compile([
      OPS.OP_2,
      Buffer.from(addresses[0].publicKey, 'hex'),
      Buffer.from(addresses[1].publicKey, 'hex'),
      OPS.OP_2,
      OPS.OP_CHECKMULTISIG
    ])

    const multisigOutputTwo = bitcoinJs.script.compile([
      OPS.OP_2,
      Buffer.from(addresses[1].publicKey, 'hex'),
      Buffer.from(addresses[0].publicKey, 'hex'),
      OPS.OP_2,
      OPS.OP_CHECKMULTISIG
    ])

    const paymentVariantOne = bitcoinJs.payments.p2sh({
      redeem: { output: multisigOutputOne, network: network as BitcoinCashNetwork },
      network: network as BitcoinCashNetwork
    })
    const paymentVariantTwo = bitcoinJs.payments.p2sh({
      redeem: { output: multisigOutputTwo, network: network as BitcoinCashNetwork },
      network: network as BitcoinCashNetwork
    })

    const addressOne = paymentVariantOne.address
    const addressTwo = paymentVariantTwo.address

    const initiationTx = await chain.client.chain.sendBatchTransaction([
      { to: addressOne, value },
      { to: addressTwo, value }
    ])
    await mineBlock(chain)

    const multiOne: any = {}
    const multiTwo: any = {}

    for (const voutIndex in initiationTx._raw.vout) {
      const vout = initiationTx._raw.vout[voutIndex]
      const paymentVariantEntryOne = paymentVariantOne.output.toString('hex') === vout.scriptPubKey.hex
      const paymentVariantEntryTwo = paymentVariantTwo.output.toString('hex') === vout.scriptPubKey.hex
      if (paymentVariantEntryOne) multiOne.multiVout = vout
      if (paymentVariantEntryTwo) multiTwo.multiVout = vout
    }

    const txb = new bitcoinJs.TransactionBuilder(network as BitcoinCashNetwork)
    const txfee = BitcoinCashUtils.calculateFee(3, 3, 9)

    multiOne.multiVout.vSat = value.toNumber()
    multiTwo.multiVout.vSat = value.toNumber()

    txb.addInput(initiationTx.hash, multiOne.multiVout.n, 0, paymentVariantOne.output)
    txb.addInput(initiationTx.hash, multiTwo.multiVout.n, 0, paymentVariantTwo.output)

    const addr = new BitcoinCashUtils.bitcoreCash.Address(unusedAddressTwo.toString())
    txb.addOutput(addr.toLegacyAddress(), value.toNumber() * 2 - txfee)

    const tx = txb.buildIncomplete()

    const signaturesOne = await chain.client.getMethod('signBatchP2SHTransaction')(
      [
        {
          inputTxHex: initiationTx._raw.hex,
          index: 0,
          vout: multiOne.multiVout,
          outputScript: paymentVariantOne.redeem.output
        },
        {
          inputTxHex: initiationTx._raw.hex,
          index: 1,
          vout: multiTwo.multiVout,
          outputScript: paymentVariantTwo.redeem.output
        }
      ],
      [addresses[0].address, addresses[0].address],
      tx,
      0,
      true
    )

    const signaturesTwo = await chain.client.getMethod('signBatchP2SHTransaction')(
      [
        {
          inputTxHex: initiationTx._raw.hex,
          index: 0,
          vout: multiOne.multiVout,
          outputScript: paymentVariantOne.redeem.output
        },
        {
          inputTxHex: initiationTx._raw.hex,
          index: 1,
          vout: multiTwo.multiVout,
          outputScript: paymentVariantTwo.redeem.output
        }
      ],
      [addresses[1].address, addresses[1].address],
      tx,
      0,
      true
    )
    const multiOneInput = bitcoinJs.script.compile([OPS.OP_0, signaturesOne[0], signaturesTwo[0]])

    const multiTwoInput = bitcoinJs.script.compile([OPS.OP_0, signaturesTwo[1], signaturesOne[1]])

    multiOne.paymentParams = { redeem: { output: multisigOutputOne, input: multiOneInput, network }, network }
    multiTwo.paymentParams = { redeem: { output: multisigOutputTwo, input: multiTwoInput, network }, network }

    multiOne.paymentWithInput = bitcoinJs.payments.p2sh(multiOne.paymentParams)
    multiTwo.paymentWithInput = bitcoinJs.payments.p2sh(multiTwo.paymentParams)

    tx.setInputScript(0, multiOne.paymentWithInput.input!)
    tx.setInputScript(1, multiTwo.paymentWithInput.input!)

    const claimTxHash = await chain.client.getMethod('sendRawTransaction')(tx.toHex())

    await mineBlock(chain)

    const claimTxRaw = await chain.client.getMethod('getRawTransactionByHash')(claimTxHash)
    const claimTx = await chain.client.getMethod('decodeRawTransaction')(claimTxRaw)

    const claimVouts = claimTx.vout
    const claimVins = claimTx.vin

    expect(claimVins.length).to.equal(2)
    expect(claimVouts.length).to.equal(1)
  })
}

describe('Transactions', function () {
  this.timeout(TEST_TIMEOUT)

  describe('Bitcoin Cash - Node', () => {
    testTransaction(chains.bitcoinCashWithNode)
    testBatchTransaction(chains.bitcoinCashWithNode)
    testSignBatchP2SHTransaction(chains.bitcoinCashWithNode)
  })

  describe('Bitcoin Cash - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinCashWithJs)
      await fundWallet(chains.bitcoinCashWithJs)
    })
    testTransaction(chains.bitcoinCashWithJs)
    testBatchTransaction(chains.bitcoinCashWithJs)
    testSignBatchP2SHTransaction(chains.bitcoinCashWithJs)
    testSweepTransaction(chains.bitcoinCashWithJs)
  })
})
