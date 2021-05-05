import { BitcoinCashNetwork, BitcoinCashNetworks } from '../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import { Address, Transaction, bitcoinCash as bT } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'

import BigNumber from 'bignumber.js'
import * as bitcoin from 'bitcoinjs-lib'
import * as classify from 'bitcoinjs-lib/src/classify'
import coinselect from 'coinselect'
import coinselectAccumulative from 'coinselect/accumulative'
import { SwapScriptHashInput, bitcoreCash } from './SwapOutput'

function classifyScript(script: bitcoreCash.Script) {
  // Translate to Core's std::string GetTxnOutputType types
  const classification = script.classify()

  // Instead of checking for Bitcoin.script.types equality
  if (classification.includes('script hash')) return 'scripthash'
  if (classification.includes('multisig')) return 'multisig'
  if (classification.includes('public key hash')) return 'pubkeyhash'
  if (classification.includes('public key')) return 'pubkey'
  return 'nonstandard'
}

function bitcoreNetworkName(network: BitcoinCashNetwork) {
  switch (network.name) {
    case 'bitcoin_cash':
      return 'livenet'
    case 'bitcoin_cash_testnet':
      return 'testnet'
    case 'bitcoin_cash_regtest':
      return 'regtest'
  }
}

function calculateFee(numInputs: number, numOutputs: number, feePerByte: number) {
  return (numInputs * 148 + numOutputs * 34 + 10) * feePerByte
}

/**
 * Get compressed pubKey from pubKey.
 * @param {!string} pubKey - 65 byte string with prefix, x, y.
 * @return {string} Returns the compressed pubKey of uncompressed pubKey.
 */
function compressPubKey(pubKey: string) {
  const x = pubKey.substring(2, 66)
  const y = pubKey.substring(66, 130)
  const even = parseInt(y.substring(62, 64), 16) % 2 === 0
  const prefix = even ? '02' : '03'

  return prefix + x
}

/**
 * Get a network object from an address
 * @param {string} address The bitcoin address
 * @return {Network}
 */
function getAddressNetwork(address: string) {
  const addr = address.toLowerCase()
  if (addr.startsWith('bchreg:')) return BitcoinCashNetworks.bitcoin_cash_regtest
  if (addr.startsWith('bchtest:')) return BitcoinCashNetworks.bitcoin_cash_testnet
  return BitcoinCashNetworks.bitcoin_cash
}

type CoinSelectTarget = {
  value: number
  id?: string
}

type CoinSelectResponse = {
  inputs: bT.UTXO[]
  outputs: CoinSelectTarget[]
  change: CoinSelectTarget
  fee: number
}

type CoinSelectFunction = (utxos: bT.UTXO[], targets: CoinSelectTarget[], feePerByte: number) => CoinSelectResponse

function selectCoins(utxos: bT.UTXO[], targets: CoinSelectTarget[], feePerByte: number, fixedInputs: bT.UTXO[] = []) {
  let selectUtxos = utxos

  // Default coinselect won't accumulate some inputs
  // TODO: does coinselect need to be modified to ABSOLUTELY not skip an input?
  const coinselectStrat: CoinSelectFunction = fixedInputs.length ? coinselectAccumulative : coinselect
  if (fixedInputs.length) {
    selectUtxos = [
      // Order fixed inputs to the start of the list so they are used
      ...fixedInputs,
      ...utxos.filter((utxo) => !fixedInputs.find((input) => input.vout === utxo.vout && input.txid === utxo.txid))
    ]
  }

  const { inputs, outputs, fee } = coinselectStrat(selectUtxos, targets, Math.ceil(feePerByte))

  let change
  if (inputs && outputs) {
    change = outputs.find((output) => output.id !== 'main')
  }

  return { inputs, outputs, fee, change }
}

function decodeRawTransaction(hex: string, network: BitcoinCashNetwork): bT.Transaction {
  const tx = new bitcoreCash.Transaction(hex)
  const vin = tx.inputs.map((input) => {
    input.script.toASM()
    return <bT.Input>{
      txid: input.prevTxId.toString('hex'),
      vout: input.outputIndex,
      scriptSig: {
        asm: input.script.toASM(),
        hex: input.script.toHex()
      },
      sequence: input.sequenceNumber
    }
  })

  const vout = tx.outputs.map((output, n) => {
    const vout: bT.Output = {
      value: output.satoshis * 1e-8,
      n,
      scriptPubKey: {
        asm: output.script.toASM(),
        hex: output.script.toHex(),
        reqSigs: 1, // TODO: not sure how to derive this
        type: classifyScript(output.script),
        addresses: []
      }
    }

    try {
      // fromOutputScript of bch-js could also be used
      const address = bitcoreCash.Address.fromScript(output.script, bitcoreNetworkName(network)).toString()
      vout.scriptPubKey.addresses.push(address)
    } catch (e) {
      /** If output script is not parsable, we just skip it */
    }

    return vout
  })

  return {
    // @ts-ignore
    txid: tx._getHash().reverse().toString('hex'),
    // @ts-ignore
    hash: tx._getHash().reverse().toString('hex'),
    // @ts-ignore
    version: tx.version,
    // @ts-ignore
    locktime: tx.nLockTime,
    size: tx.uncheckedSerialize().length / 2,
    vsize: 0,
    weight: 0,
    vin,
    vout,
    hex
  }
}

function normalizeTransactionObject(
  tx: bT.Transaction,
  fee: number,
  block?: { number: number; hash: string }
): Transaction<bT.Transaction> {
  const value = tx.vout.reduce((p, n) => p.plus(new BigNumber(n.value).times(1e8)), new BigNumber(0))
  const result = {
    hash: tx.txid,
    value: value.toNumber(),
    _raw: tx,
    confirmations: 0
  }

  if (fee) {
    const feePrice = Math.round(fee / tx.size)
    Object.assign(result, {
      fee,
      feePrice
    })
  }

  if (block) {
    Object.assign(result, {
      blockHash: block.hash,
      blockNumber: block.number,
      confirmations: tx.confirmations
    })
  }

  return result
}

function getPubKeyHash(address: string, network: BitcoinCashNetwork) {
  // Bitcore doesn't provide an equivalent

  let oldAddress
  try {
    oldAddress = new bitcoreCash.Address(address, bitcoreNetworkName(network)).toLegacyAddress()
  } catch (e) {
    throw new InvalidAddressError(`Invalid Bitcoin Cash address: ${address}.`)
  }

  const outputScript = bitcoin.address.toOutputScript(oldAddress, network)
  const type = classify.output(outputScript)
  if (classify.types.P2PKH != type) {
    throw new Error(
      `Bitcoin Cash swap doesn't support the address ${address} type of ${type}. Not possible to derive public key hash.`
    )
  }

  const base58 = bitcoin.address.fromBase58Check(oldAddress)
  return base58.hash
}

function validateAddress(_address: Address | string, network: BitcoinCashNetwork) {
  const address = addressToString(_address)

  if (typeof address !== 'string') {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }

  let pubKeyHash
  try {
    pubKeyHash = getPubKeyHash(address, network)
  } catch (e) {
    throw new InvalidAddressError(`Invalid Address. Failed to parse: ${address}`)
  }

  if (!pubKeyHash) {
    throw new InvalidAddressError(`Invalid Address: ${address}`)
  }
}

function constructSweepSwap(
  privateKey: bitcoreCash.PrivateKey,
  utxo: any,
  secretHash: Buffer,
  recipientPublicKey: Buffer,
  refundPublicKey: Buffer,
  expiration: number,
  toAddress: Address,
  fromAddress: Address,
  outValue: number,
  feePerByte: number,
  secret?: Buffer
) {
  let tx = new bitcoreCash.Transaction()
  if (feePerByte) {
    tx = tx.feePerByte(feePerByte)
  }
  const out = new bitcoreCash.Transaction.Output({
    script: utxo['script'],
    satoshis: utxo['satoshis']
  })

  tx.addInput(
    // @ts-ignore
    new SwapScriptHashInput(
      {
        output: out,
        prevTxId: utxo['txid'],
        outputIndex: utxo['outputIndex'],
        script: bitcoreCash.Script.empty()
      },
      secretHash,
      recipientPublicKey,
      refundPublicKey,
      expiration,
      secret
    )
  )

  // This must run after adding at least one input
  if (!secret) {
    ;(tx as any).nLockTime = expiration
    for (let i = 0; i < tx.inputs.length; i++) {
      if (tx.inputs[i].sequenceNumber === (bitcoreCash.Transaction.Input as any).DEFAULT_SEQNUMBER) {
        ;(tx.inputs[i].sequenceNumber as any) = (bitcoreCash.Transaction.Input as any).DEFAULT_LOCKTIME_SEQNUMBER
      }
    }
  }

  tx.addOutput(
    new bitcoreCash.Transaction.Output({
      script: bitcoreCash.Script.fromAddress(new bitcoreCash.Address(toAddress)),
      satoshis: outValue
    })
  )

  // Remove the change output if it exits
  const changeIndex = (tx as any)._changeIndex
  if (changeIndex) {
    const changeOutput = tx.outputs[changeIndex]
    const totalOutputAmount = (tx as any)._outputAmount
    ;(tx as any)._removeOutput(changeIndex)
    ;(tx as any)._outputAmount = totalOutputAmount - changeOutput.satoshis
    ;(tx as any)._changeIndex = undefined
  }

  return tx.sign(privateKey).uncheckedSerialize()
}

export {
  calculateFee,
  compressPubKey,
  getAddressNetwork,
  selectCoins,
  decodeRawTransaction,
  normalizeTransactionObject,
  bitcoreNetworkName,
  bitcoreCash,
  getPubKeyHash,
  validateAddress,
  constructSweepSwap
}
