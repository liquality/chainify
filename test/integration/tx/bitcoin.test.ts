/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as bitcoinJs from 'bitcoinjs-lib'
import { hash160 } from '../../../packages/crypto/lib'
import { BigNumber, Transaction, bitcoin } from '../../../packages/types/lib'
import * as BitcoinUtils from '../../../packages/bitcoin-utils/lib'
import {
  TEST_TIMEOUT,
  Chain,
  chains,
  importBitcoinAddresses,
  getNewAddress,
  getRandomBitcoinAddress,
  mineBlock,
  fundWallet,
  fundAddress,
  describeExternal
} from '../common'
import { testTransaction } from './common'
import config from '../config'
import { BitcoinNetwork, ProtocolType } from '../../../packages/bitcoin-networks/lib'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

function testBatchTransaction(chain: Chain) {
  it('Sent value to 2 addresses', async () => {
    const addr1 = await getRandomBitcoinAddress(chain)
    const addr2 = await getRandomBitcoinAddress(chain)

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

function testSweepTransaction(chain: Chain, nodeChain: Chain) {
  it('should sweep wallet balance', async () => {
    await fundWallet(chains.bitcoinWithJs)

    const nonChangeAddresses = await chain.client.wallet.getAddresses(0, 20, false)
    const changeAddresses = await chain.client.wallet.getAddresses(0, 20, true)
    const addrList = nonChangeAddresses.concat(changeAddresses)

    const bal = (await chain.client.chain.getBalance(addrList)).toNumber()

    let sendTxChain
    if (bal === 0) {
      sendTxChain = nodeChain
    } else {
      sendTxChain = chain
    }

    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[1], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[2], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[3], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[4], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[5], value: new BigNumber(200000000) })
    await sendTxChain.client.chain.sendTransaction({ to: changeAddresses[6], value: new BigNumber(200000000) })

    const addr1 = await getRandomBitcoinAddress(chain)

    await chain.client.chain.sendSweepTransaction(addr1)

    const balanceAfter = await chain.client.chain.getBalance(changeAddresses)
    expect(balanceAfter.toString()).to.equal('0')
  })
}

function testSignPSBTSimple(chain: Chain) {
  it('should sign psbt a simple send', async () => {
    const network = chain.network as BitcoinNetwork

    const unusedAddressOne = await getNewAddress(chain)

    // So that the next address can be retrieved
    await fundAddress(chain, unusedAddressOne.address, new BigNumber(2000000))

    const unusedAddressTwo = await getNewAddress(chain)
    const tx = await chain.client.chain.sendBatchTransaction([
      { to: unusedAddressOne.address, value: new BigNumber(2000000) },
      { to: unusedAddressTwo.address, value: new BigNumber(1000000) }
    ])
    const utxo1 = tx._raw.vout.find(
      (vout: bitcoin.Output) => unusedAddressOne.address === vout.scriptPubKey.addresses[0]
    )
    const utxo2 = tx._raw.vout.find(
      (vout: bitcoin.Output) => unusedAddressTwo.address === vout.scriptPubKey.addresses[0]
    )

    const psbt = new bitcoinJs.Psbt({ network })
    const txfee = BitcoinUtils.calculateFee(1, 1, 5)

    psbt.addInput({
      hash: tx.hash,
      index: utxo1.n,
      sequence: 0,
      witnessUtxo: {
        script: Buffer.from(utxo1.scriptPubKey.hex, 'hex'),
        value: 2000000
      }
    })

    psbt.addInput({
      hash: tx.hash,
      index: utxo2.n,
      sequence: 0,
      witnessUtxo: {
        script: Buffer.from(utxo2.scriptPubKey.hex, 'hex'),
        value: 1000000
      }
    })

    psbt.addOutput({
      address: BitcoinUtils.addrToBitcoinJS((await getNewAddress(chain)).address, network),
      value: 3000000 - txfee
    })

    const signedPSBTHex = await chain.client.getMethod('signPSBT')(psbt.toBase64(), [
      { index: 0, derivationPath: unusedAddressOne.derivationPath },
      { index: 1, derivationPath: unusedAddressTwo.derivationPath }
    ])

    const signedPSBT = bitcoinJs.Psbt.fromBase64(signedPSBTHex, { network })
    let hex
    if (network.protocolType == ProtocolType.BitcoinCash) {
      hex = BitcoinUtils.psbtToHexTransactionBitcoinCash(signedPSBT.toHex())
    } else {
      signedPSBT.finalizeAllInputs()
      hex = signedPSBT.extractTransaction().toHex()
    }

    await mineBlock(chain)
    await mineBlock(chain)
    await mineBlock(chain)
    await mineBlock(chain)

    const payment3TxHash = await chain.client.chain.sendRawTransaction(hex)

    await mineBlock(chain)

    const payment3: Transaction<bitcoin.Transaction> = await chain.client.chain.getTransactionByHash(payment3TxHash)

    expect(payment3._raw.vin.length).to.equal(2)
    expect(payment3._raw.vout.length).to.equal(1)
  })
}

function testSignPSBTScript(chain: Chain, legacy: boolean) {
  it('should send p2sh and sign PSBT to redeem', async () => {
    const network = chain.network
    const value = config[chain.name as keyof typeof config].value
    const OPS = bitcoinJs.script.OPS

    const { address: unusedAddressOne, derivationPath: unusedAddressOneDerivationPath } = await getNewAddress(chain)
    await chain.client.chain.sendTransaction({ to: unusedAddressOne, value })
    await mineBlock(chain)

    const { address: unusedAddressTwo } = await getNewAddress(chain)

    const newAddresses = [unusedAddressOne]

    const addresses = []
    for (const newAddress of newAddresses) {
      const address = await chain.client.getMethod('getWalletAddress')(newAddress)
      addresses.push(address)
    }

    const multisigOutput = bitcoinJs.script.compile([
      OPS.OP_DUP,
      OPS.OP_HASH160,
      Buffer.from(hash160(addresses[0].publicKey), 'hex'),
      OPS.OP_EQUALVERIFY,
      OPS.OP_CHECKSIG
    ])

    const variant = legacy ? bitcoinJs.payments.p2sh : bitcoinJs.payments.p2wsh

    const paymentVariant = variant({
      redeem: { output: multisigOutput, network: network as BitcoinNetwork },
      network: network as BitcoinNetwork
    })

    const address = paymentVariant.address
    const initiationTx: Transaction<bitcoin.Transaction> = await chain.client.chain.sendTransaction({
      to: address,
      value
    })
    await mineBlock(chain)

    let multiVout: bitcoin.Output

    for (const voutIndex in initiationTx._raw.vout) {
      const vout = initiationTx._raw.vout[voutIndex]
      const paymentVariantEntryOne = paymentVariant.output.toString('hex') === vout.scriptPubKey.hex
      if (paymentVariantEntryOne) multiVout = vout
    }

    const psbt = new bitcoinJs.Psbt({ network: network as BitcoinNetwork })
    const txfee = BitcoinUtils.calculateFee(3, 3, 9)

    let input
    if (legacy) {
      input = {
        hash: initiationTx.hash,
        index: multiVout.n,
        sequence: 0,
        witnessUtxo: {
          script: paymentVariant.output,
          value: value.toNumber()
        },
        redeemScript: paymentVariant.redeem.output
      }
    } else {
      input = {
        hash: initiationTx.hash,
        index: multiVout.n,
        sequence: 0,
        witnessUtxo: {
          script: paymentVariant.output,
          value: value.toNumber()
        },
        witnessScript: paymentVariant.redeem.output
      }
    }

    const output = {
      address: BitcoinUtils.addrToBitcoinJS(unusedAddressTwo, network as BitcoinNetwork),
      value: value.toNumber() - txfee
    }

    psbt.addInput(input)
    psbt.addOutput(output)

    const signedPSBTHex = await chain.client.getMethod('signPSBT')(psbt.toBase64(), [
      { index: 0, derivationPath: unusedAddressOneDerivationPath }
    ])
    const signedPSBT = bitcoinJs.Psbt.fromBase64(signedPSBTHex, { network: network as BitcoinNetwork })
    let hex
    if ((network as BitcoinNetwork).protocolType == ProtocolType.BitcoinCash) {
      hex = BitcoinUtils.psbtToHexTransactionBitcoinCash(signedPSBT.toHex())
    } else {
      signedPSBT.finalizeAllInputs()
      hex = signedPSBT.extractTransaction().toHex()
    }
    const claimTxHash = await chain.client.getMethod('sendRawTransaction')(hex)

    await mineBlock(chain)

    const claimTxRaw = await chain.client.getMethod('getRawTransactionByHash')(claimTxHash)
    const claimTx = await chain.client.getMethod('decodeRawTransaction')(claimTxRaw)

    const claimVouts = claimTx.vout
    const claimVins = claimTx.vin

    expect(claimVins.length).to.equal(1)
    expect(claimVouts.length).to.equal(1)
  })
}

function testSignBatchP2SHTransaction(chain: Chain, legacy: boolean) {
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

    const paymentVariant = legacy ? bitcoinJs.payments.p2sh : bitcoinJs.payments.p2wsh

    const paymentVariantOne = paymentVariant({
      redeem: { output: multisigOutputOne, network: network as BitcoinNetwork },
      network: network as BitcoinNetwork
    })
    const paymentVariantTwo = paymentVariant({
      redeem: { output: multisigOutputTwo, network: network as BitcoinNetwork },
      network: network as BitcoinNetwork
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

    const txb = new bitcoinJs.TransactionBuilder(network as BitcoinNetwork)
    const txfee = BitcoinUtils.calculateFee(3, 3, 9)

    multiOne.multiVout.vSat = value.toNumber()
    multiTwo.multiVout.vSat = value.toNumber()

    txb.addInput(initiationTx.hash, multiOne.multiVout.n, 0, paymentVariantOne.output)
    txb.addInput(initiationTx.hash, multiTwo.multiVout.n, 0, paymentVariantTwo.output)
    const addr = unusedAddressTwo.toString()
    txb.addOutput(BitcoinUtils.addrToBitcoinJS(addr, network as BitcoinNetwork), value.toNumber() * 2 - txfee)

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
      !legacy
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
      !legacy
    )

    const multiOneInput = bitcoinJs.script.compile([OPS.OP_0, signaturesOne[0], signaturesTwo[0]])

    const multiTwoInput = bitcoinJs.script.compile([OPS.OP_0, signaturesTwo[1], signaturesOne[1]])

    multiOne.paymentParams = { redeem: { output: multisigOutputOne, input: multiOneInput, network }, network }
    multiTwo.paymentParams = { redeem: { output: multisigOutputTwo, input: multiTwoInput, network }, network }

    if (legacy) {
      multiOne.paymentWithInput = bitcoinJs.payments.p2sh(multiOne.paymentParams)
      multiTwo.paymentWithInput = bitcoinJs.payments.p2sh(multiTwo.paymentParams)

      tx.setInputScript(0, multiOne.paymentWithInput.input)
      tx.setInputScript(1, multiTwo.paymentWithInput.input)
    } else {
      multiOne.paymentWithInput = bitcoinJs.payments.p2wsh(multiOne.paymentParams)
      multiTwo.paymentWithInput = bitcoinJs.payments.p2wsh(multiTwo.paymentParams)

      tx.setWitness(0, multiOne.paymentWithInput.witness)
      tx.setWitness(1, multiTwo.paymentWithInput.witness)
    }

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

  describeExternal('Bitcoin - Ledger', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithLedger)
      await fundWallet(chains.bitcoinWithLedger)
    })
    testTransaction(chains.bitcoinWithLedger)
    testBatchTransaction(chains.bitcoinWithLedger)
    testSignPSBTSimple(chains.bitcoinWithLedger)
    testSignPSBTScript(chains.bitcoinWithLedger, false)
    testSignBatchP2SHTransaction(chains.bitcoinWithLedger, false)
  })

  describe('Bitcoin - Node', () => {
    testTransaction(chains.bitcoinWithNode)
    testBatchTransaction(chains.bitcoinWithNode)
    testSignPSBTSimple(chains.bitcoinWithNode)
    testSignPSBTScript(chains.bitcoinWithNode, false)
    testSignBatchP2SHTransaction(chains.bitcoinWithNode, false)
    testSignBatchP2SHTransaction(chains.bitcoinWithNode, true)
  })

  describe('Bitcoin - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithJs)
      await fundWallet(chains.bitcoinWithJs)
    })
    testTransaction(chains.bitcoinWithJs)
    testBatchTransaction(chains.bitcoinWithJs)
    testSignPSBTSimple(chains.bitcoinWithJs)
    testSignPSBTScript(chains.bitcoinWithJs, false)
    testSignBatchP2SHTransaction(chains.bitcoinWithJs, false)
    testSignBatchP2SHTransaction(chains.bitcoinWithJs, true)
    testSweepTransaction(chains.bitcoinWithJs, chains.bitcoinWithNode)
  })

  describe('Bitcoin Cash - Node', () => {
    testTransaction(chains.bitcoinCashWithNode)
    testBatchTransaction(chains.bitcoinCashWithNode)
    testSignPSBTSimple(chains.bitcoinCashWithNode)
    testSignPSBTScript(chains.bitcoinCashWithNode, true)
    testSignBatchP2SHTransaction(chains.bitcoinCashWithNode, true)
  })

  describe('Bitcoin Cash - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinCashWithJs)
      await fundWallet(chains.bitcoinCashWithJs)
    })
    testTransaction(chains.bitcoinCashWithJs)
    testBatchTransaction(chains.bitcoinCashWithJs)
    testSignPSBTSimple(chains.bitcoinCashWithJs)
    testSignPSBTScript(chains.bitcoinCashWithJs, true)
    testSignBatchP2SHTransaction(chains.bitcoinCashWithJs, true)
    testSweepTransaction(chains.bitcoinCashWithJs, chains.bitcoinCashWithNode)
  })
})
