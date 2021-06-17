import { base58, padHexStart } from '@liquality/crypto'
import { BitcoinNetworks, BitcoinNetwork, BitcoinCashNetwork, ProtocolType } from '@liquality/bitcoin-networks'
import { Address, Transaction, bitcoin as bT } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'

import * as cashaddr from 'cashaddrjs'
import bs58check from 'bs58check'

import { findKey } from 'lodash'
import BigNumber from 'bignumber.js'
import * as bitcoin from 'bitcoinjs-lib'
import * as classify from 'bitcoinjs-lib/src/classify'
import * as varuint from 'bip174/src/lib/converter/varint'
import coinselect from 'coinselect'
import coinselectAccumulative from 'coinselect/accumulative'

const AddressTypes = ['legacy', 'p2sh-segwit', 'bech32']

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
  // TODO: can this be simplified using just bitcoinjs-lib??
  let networkKey
  // bech32
  networkKey = findKey(BitcoinNetworks, (network) => address.startsWith(network.bech32))
  // base58
  if (!networkKey) {
    const prefix = base58.decode(address).toString('hex').substring(0, 2)
    networkKey = findKey(BitcoinNetworks, (network) => {
      const pubKeyHashPrefix = padHexStart(network.pubKeyHash.toString(16), 1)
      const scriptHashPrefix = padHexStart(network.scriptHash.toString(16), 1)
      return [pubKeyHashPrefix, scriptHashPrefix].includes(prefix)
    })
  }
  return (BitcoinNetworks as { [key: string]: BitcoinNetwork })[networkKey]
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

const OUTPUT_TYPES_MAP = {
  [classify.types.P2WPKH]: 'witness_v0_keyhash',
  [classify.types.P2WSH]: 'witness_v0_scripthash'
}

function decodeRawTransaction(hex: string, network: BitcoinNetwork): bT.Transaction {
  const bjsTx = bitcoin.Transaction.fromHex(hex)

  const vin = bjsTx.ins.map((input) => {
    return <bT.Input>{
      txid: Buffer.from(input.hash).reverse().toString('hex'),
      vout: input.index,
      scriptSig: {
        asm: bitcoin.script.toASM(input.script),
        hex: input.script.toString('hex')
      },
      txinwitness: input.witness.map((w) => w.toString('hex')),
      sequence: input.sequence
    }
  })

  const vout = bjsTx.outs.map((output, n) => {
    const type = classify.output(output.script)

    const vout: bT.Output = {
      value: output.value / 1e8,
      n,
      scriptPubKey: {
        asm: bitcoin.script.toASM(output.script),
        hex: output.script.toString('hex'),
        reqSigs: 1, // TODO: not sure how to derive this
        type: OUTPUT_TYPES_MAP[type] || type,
        addresses: []
      }
    }

    try {
      const address = bitcoin.address.fromOutputScript(output.script, network)
      vout.scriptPubKey.addresses.push(addrFromBitcoinJS(address, network))
    } catch (e) {
      /** If output script is not parasable, we just skip it */
    }

    return vout
  })

  return {
    txid: bjsTx.getHash(false).reverse().toString('hex'),
    hash: bjsTx.getHash(true).reverse().toString('hex'),
    version: bjsTx.version,
    locktime: bjsTx.locktime,
    size: bjsTx.byteLength(),
    vsize: bjsTx.virtualSize(),
    weight: bjsTx.weight(),
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
    const feePrice = Math.round(fee / (tx.vsize ? tx.vsize : tx.size))
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

// TODO: This is copy pasta because it's not exported from bitcoinjs-lib
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/csv.spec.ts#L477
function witnessStackToScriptWitness(witness: Buffer[]): Buffer {
  let buffer = Buffer.allocUnsafe(0)

  function writeSlice(slice: Buffer): void {
    buffer = Buffer.concat([buffer, Buffer.from(slice)])
  }

  function writeVarInt(i: number): void {
    const currentLen = buffer.length
    const varintLen = varuint.encodingLength(i)

    buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)])
    varuint.encode(i, buffer, currentLen)
  }

  function writeVarSlice(slice: Buffer): void {
    writeVarInt(slice.length)
    writeSlice(slice)
  }

  function writeVector(vector: Buffer[]): void {
    writeVarInt(vector.length)
    vector.forEach(writeVarSlice)
  }

  writeVector(witness)

  return buffer
}

function getPubKeyHash(address: string, network: BitcoinNetwork) {
  address = addrToBitcoinJS(address, network)

  const outputScript = bitcoin.address.toOutputScript(address, network)
  const type = classify.output(outputScript)
  if (![classify.types.P2PKH, classify.types.P2WPKH].includes(type)) {
    throw new Error(
      `Bitcoin swap doesn't support the address ${address} type of ${type}. Not possible to derive public key hash.`
    )
  }

  try {
    const bech32 = bitcoin.address.fromBech32(address)
    return bech32.data
  } catch (e) {
    const base58 = bitcoin.address.fromBase58Check(address)
    return base58.hash
  }
}

function validateAddress(_address: Address | string, network: BitcoinNetwork) {
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

// Convert from different address format to BitcoinJS's format
// that is, Bitcoin's address format

// Currently, we allow it if the conversion is already done

function addrToBitcoinJS(address: string, network: BitcoinNetwork) {
  if (network.protocolType == ProtocolType.Bitcoin) return address
  if (network.protocolType == ProtocolType.BitcoinCash) {
    // Older addresses have historically been allowed
    try {
      bs58check.decode(address)
      return address
    } catch (e) {
      /**/
    }

    try {
      if (!address.includes(':')) address = 'bitcoincash:' + address
      const { prefix, type, hash } = cashaddr.decode(address)
      const isTestnet = prefix != 'bitcoincash' ? 1 : 0
      const isP2SH = type != 'P2PKH' ? 1 : 0
      const prefixbyte = [0x00, 0x05, 0x6f, 0xc4][(2 * isTestnet) | isP2SH]
      return bs58check.encode(Buffer.concat([Buffer.from([prefixbyte]), Buffer.from(hash)]))
    } catch (e) {
      throw new InvalidAddressError(`Invalid Address: ${address}`)
    }
  }
}

function addrFromBitcoinJS(address: string, network: BitcoinNetwork) {
  if (network.protocolType == ProtocolType.Bitcoin) return address
  if (network.protocolType == ProtocolType.BitcoinCash) {
    // Case: Already converted
    try {
      let addr2 = address
      if (!addr2.includes(':')) addr2 = 'bitcoincash:' + addr2
      cashaddr.decode(addr2)
      return addr2
    } catch (e) {
      /**/
    }

    try {
      const decoded = bs58check.decode(address)
      const prefixbyte = [0x00, 0x05, 0x6f, 0xc4].findIndex((a) => a == decoded[0])
      if (prefixbyte == -1) throw new InvalidAddressError(`Invalid Address Version Byte: ${address}`)

      const isTestnet = !!(prefixbyte & 2)
      const type = prefixbyte & 1 ? 'P2SH' : 'P2PKH'
      if (isTestnet) {
        if (!network.name.includes('regtest') && !network.name.includes('testnet')) {
          throw new InvalidAddressError(`Network Mismatch: ${address}`)
        }
      } else {
        if (network.name.includes('regtest') || network.name.includes('testnet')) {
          throw new InvalidAddressError(`Network Mismatch: ${address}`)
        }
      }
      return cashaddr.encode((network as BitcoinCashNetwork).prefix, type, decoded.slice(1)) as string
    } catch (e) {
      if (e instanceof InvalidAddressError) throw e
      throw new InvalidAddressError(`Invalid Address: ${address}`)
    }
  }
}

function txApplyBitcoinCashSighash(hex1: string, hex2: string, sighash = '41') {
  // Encode twice with different allowed sighashes
  // to locate them in the final hex and replace
  // them with the BTC-incompatible SigHash
  // which BitcoinJS-lib does not let us encode

  // updateInput and finalizeAllInputs cannot encode non-BTC SigHash.
  // After creating signature, change the sighash mark to a BTC one
  // Scenario 1: finalize input, extract tx, call this func to serialize tx
  // Scenario 2: serialize psbt as hex, call this func and decode and encode as base64

  const hexArray = hex1.split('')
  const diff = Array(hexArray.length)

  for (let i = 0; i < diff.length; i++) {
    diff[i] = hex1.charCodeAt(i) ^ hex2.charCodeAt(i)
  }

  for (let i = 0; i < diff.length; i++) {
    if (diff[i]) {
      hexArray[i - 1] = sighash[0]
      hexArray[i] = sighash[1]
    }
  }

  return hexArray.join('')
}

function psbtToHexTransactionBitcoinCash(psbt: string, finalScriptsFunc?: [any]) {
  // Equivalent to finalizeAllInputs and extractTransaction
  // Call finalScriptsFunc with funcs and nulls
  const psbt1 = bitcoin.Psbt.fromHex(psbt)
  const psbt2 = psbt1.clone()

  for (let i = 0; i < psbt1.data.inputs.length; i++) {
    const pk = psbt1.data.inputs[i].partialSig
    for (let a = 0; a < pk.length; a++) {
      const sigHashIndex = pk[a].signature.length - 1
      psbt1.data.inputs[i].partialSig[a].signature[sigHashIndex] = 1
      psbt2.data.inputs[i].partialSig[a].signature[sigHashIndex] = 2
    }
  }
  for (let i = 0; i < psbt1.data.inputs.length; i++) {
    if (finalScriptsFunc && finalScriptsFunc[i]) {
      psbt1.finalizeInput(i, finalScriptsFunc[i])
      psbt2.finalizeInput(i, finalScriptsFunc[i])
    } else {
      psbt1.finalizeInput(i)
      psbt2.finalizeInput(i)
    }
  }
  const hex1 = psbt1.extractTransaction().toHex()
  const hex2 = psbt2.extractTransaction().toHex()

  return txApplyBitcoinCashSighash(hex1, hex2)
}

export {
  calculateFee,
  compressPubKey,
  getAddressNetwork,
  selectCoins,
  decodeRawTransaction,
  normalizeTransactionObject,
  witnessStackToScriptWitness,
  AddressTypes,
  getPubKeyHash,
  validateAddress,
  addrToBitcoinJS,
  addrFromBitcoinJS,
  txApplyBitcoinCashSighash,
  psbtToHexTransactionBitcoinCash
}
