import { LedgerProvider } from '@liquality/ledger-provider'
import { BitcoinWalletProvider } from '@liquality/bitcoin-wallet-provider'

import { padHexStart } from '@liquality/crypto'
import {
  compressPubKey,
  getAddressNetwork,
  decodeRawTransaction,
  addrToBitcoinJS,
  txApplyBitcoinCashSighash
} from '@liquality/bitcoin-utils'
import { BitcoinNetworks, BitcoinCashNetworks, BitcoinNetwork, ProtocolType } from '@liquality/bitcoin-networks'
import { bitcoin, BigNumber } from '@liquality/types'
import HwAppBitcoin from '@ledgerhq/hw-app-btc'
import { fromPublicKey, BIP32Interface } from 'bip32'
import { address, Psbt, PsbtTxInput, Transaction as BitcoinJsTransaction, script } from 'bitcoinjs-lib'

type WalletProviderConstructor<T = LedgerProvider<HwAppBitcoin>> = new (...args: any[]) => T

interface BitcoinLedgerProviderOptions {
  network: BitcoinNetwork
  Transport: any
  baseDerivationPath: string
  addressType?: bitcoin.AddressType
}

export default class BitcoinLedgerProvider extends BitcoinWalletProvider(LedgerProvider as WalletProviderConstructor) {
  _walletPublicKeyCache: { [index: string]: any }
  _baseDerivationNode: BIP32Interface

  constructor(options: BitcoinLedgerProviderOptions) {
    const {
      network,
      baseDerivationPath,
      addressType = network.segwitCapable ? bitcoin.AddressType.BECH32 : bitcoin.AddressType.LEGACY,
      Transport
    } = options
    super({ network, baseDerivationPath, addressType, App: HwAppBitcoin, Transport, ledgerScrambleKey: 'BTC' })
    this._walletPublicKeyCache = {}
  }

  async signMessage(message: string, from: string) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    const sig = await app.signMessageNew(address.derivationPath, hex)
    return sig.r + sig.s
  }

  async _buildTransaction(
    targets: bitcoin.OutputTarget[],
    feePerByte?: number,
    fixedInputs?: bitcoin.Input[]
  ): Promise<{ hex: string; fee: number }> {
    const app = await this.getApp()

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs)
    const ledgerInputs = await this.getLedgerInputs(inputs)
    const paths = inputs.map((utxo) => utxo.derivationPath)

    const tryAddrToBitcoinJS = (address: string, network: BitcoinNetwork) => {
      try {
        address = addrToBitcoinJS(address, network)
      } catch (e) {
        /**/
      }
      return address
    }

    const outputs = targets.map((output) => {
      const outputScript = Buffer.isBuffer(output.address)
        ? output.address
        : address.toOutputScript(tryAddrToBitcoinJS(output.address, this._network), this._network) // Allow for OP_RETURN
      return { amount: this.getAmountBuffer(output.value), script: outputScript }
    })

    if (change) {
      outputs.push({
        amount: this.getAmountBuffer(change.value),
        script: address.toOutputScript(addrToBitcoinJS(unusedAddress.address, this._network), this._network)
      })
    }

    const outputScriptHex = await app.serializeTransactionOutputs({ outputs }).toString('hex')

    const isSegwit = [bitcoin.AddressType.BECH32, bitcoin.AddressType.P2SH_SEGWIT].includes(this._addressType)

    const txHex = await app.createPaymentTransactionNew({
      // @ts-ignore
      inputs: ledgerInputs,
      sigHashType: this._network.protocolType == ProtocolType.BitcoinCash ? 0x41 : 0x01,
      associatedKeysets: paths,
      changePath: unusedAddress.derivationPath,
      outputScriptHex,
      segwit: isSegwit,
      useTrustedInputForSegwit: isSegwit,
      additionals:
        this._addressType === bitcoin.AddressType.BECH32
          ? ['bech32']
          : this._network.protocolType == ProtocolType.BitcoinCash
          ? ['abc']
          : []
    })

    return { hex: txHex, fee }
  }

  async signPSBT(data: string, inputs: bitcoin.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })
    const app = await this.getApp()

    const inputsArePubkey = psbt.txInputs.every((input, index) =>
      ['witnesspubkeyhash', 'pubkeyhash', 'p2sh-witnesspubkeyhash'].includes(psbt.getInputType(index))
    )

    if (inputsArePubkey && psbt.txInputs.length !== inputs.length) {
      throw new Error('signPSBT: Ledger must sign all inputs when they are all regular pub key hash payments.')
    }

    const isBCH = this._network.protocolType == ProtocolType.BitcoinCash

    if (inputsArePubkey) {
      const ledgerInputs = await this.getLedgerInputs(
        psbt.txInputs.map((input) => ({ txid: input.hash.reverse().toString('hex'), vout: input.index }))
      )

      const getInputDetails = async (input: PsbtTxInput) => {
        const txHex = await this.getMethod('getRawTransactionByHash')(input.hash.reverse().toString('hex'))
        const tx = decodeRawTransaction(txHex, this._network)
        const address = tx.vout[input.index].scriptPubKey.addresses[0]
        const walletAddress = await this.getWalletAddress(address)
        return walletAddress
      }

      const inputDetails = await Promise.all(psbt.txInputs.map(getInputDetails))
      const paths = inputDetails.map((i) => i.derivationPath)
      const outputScriptHex = app
        .serializeTransactionOutputs({
          outputs: psbt.txOutputs.map((output) => ({
            script: output.script,
            amount: this.getAmountBuffer(output.value)
          }))
        })
        .toString('hex')
      const isSegwit = [bitcoin.AddressType.BECH32, bitcoin.AddressType.P2SH_SEGWIT].includes(this._addressType)
      const changeAddress = await this.findAddress(
        psbt.txOutputs.map((output) => addrToBitcoinJS(output.address, this._network)), // todotest or not???
        true
      )

      const txHex = await app.createPaymentTransactionNew({
        // @ts-ignore
        inputs: ledgerInputs,
        sigHashType: isBCH ? 0x41 : 0x01,
        associatedKeysets: paths,
        changePath: changeAddress && changeAddress.derivationPath,
        outputScriptHex,
        segwit: isSegwit,
        useTrustedInputForSegwit: isSegwit,
        additionals: this._addressType === bitcoin.AddressType.BECH32 ? ['bech32'] : isBCH ? ['abc'] : []
      })

      const signedTransaction = BitcoinJsTransaction.fromHex(txHex)

      psbt.setVersion(1) // Ledger payment txs use v1 and there is no option to change it - fuck knows why
      for (const input of inputs) {
        const signer = {
          network: this._network,
          publicKey: Buffer.from(inputDetails[input.index].publicKey, 'hex'),
          sign: async () => {
            const sigInput = signedTransaction.ins[input.index]
            if (sigInput.witness.length) {
              return script.signature.decode(sigInput.witness[0]).signature
            } else return sigInput.script
          }
        }

        await psbt.signInputAsync(input.index, signer)
      }

      if (isBCH) {
        const psbt2 = psbt.clone()

        for (let i = 0; i < psbt2.data.inputs.length; i++) {
          const pk = psbt2.data.inputs[i].partialSig
          for (let a = 0; a < pk.length; a++) {
            const sigHashIndex = pk[a].signature.length - 1
            psbt2.data.inputs[i].partialSig[a].signature[sigHashIndex] = 2
          }
        }

        return Psbt.fromHex(txApplyBitcoinCashSighash(psbt.toHex(), psbt2.toHex())).toBase64()
      }

      return psbt.toBase64()
    }

    const ledgerInputs = []
    const walletAddresses = []
    let isSegwit = false

    for (const input of inputs) {
      const walletAddress = await this.getDerivationPathAddress(input.derivationPath)
      walletAddresses.push(walletAddress)
      const { witnessScript, redeemScript } = psbt.data.inputs[input.index]
      const { hash: inputHash, index: inputIndex } = psbt.txInputs[input.index]
      const outputScript = witnessScript || redeemScript
      const inputTxHex = await this.getMethod('getRawTransactionByHash')(inputHash.reverse().toString('hex'))
      const ledgerInputTx = await app.splitTransaction(inputTxHex, true)
      ledgerInputs.push([ledgerInputTx, inputIndex, outputScript.toString('hex'), 0])
      if (witnessScript) isSegwit = true
    }

    // @ts-ignore - accessing private method required
    const ledgerTx = await app.splitTransaction(psbt.__CACHE.__TX.toHex(), true)
    const ledgerOutputs = await app.serializeTransactionOutputs(ledgerTx)

    const ledgerSigs = await app.signP2SHTransaction({
      // @ts-ignore
      inputs: ledgerInputs,
      sigHashType: isBCH ? 0x41 : 0x01,
      associatedKeysets: walletAddresses.map((address) => address.derivationPath),
      outputScriptHex: ledgerOutputs.toString('hex'),
      lockTime: psbt.locktime,
      segwit: isSegwit,
      transactionVersion: 2
    })

    for (const input of inputs) {
      const signer = {
        network: this._network,
        publicKey: Buffer.from(walletAddresses[input.index].publicKey, 'hex'),
        sign: async () => {
          const finalSig = isSegwit ? ledgerSigs[input.index] : ledgerSigs[input.index] + '01' // Is this a ledger bug? Why non segwit signs need the sighash appended?
          const { signature } = script.signature.decode(Buffer.from(finalSig, 'hex'))
          return signature
        }
      }

      await psbt.signInputAsync(input.index, signer)
    }

    if (isBCH) {
      const psbt2 = psbt.clone()

      for (let i = 0; i < psbt2.data.inputs.length; i++) {
        const pk = psbt2.data.inputs[i].partialSig
        for (let a = 0; a < pk.length; a++) {
          const sigHashIndex = pk[a].signature.length - 1
          psbt2.data.inputs[i].partialSig[a].signature[sigHashIndex] = 2
        }
      }

      return Psbt.fromHex(txApplyBitcoinCashSighash(psbt.toHex(), psbt2.toHex())).toBase64()
    }

    return psbt.toBase64()
  }

  async signBatchP2SHTransaction(
    inputs: { inputTxHex: string; index: number; vout: any; outputScript: Buffer }[],
    addresses: string[],
    tx: any,
    lockTime?: number,
    segwit?: boolean
  ): Promise<Buffer[]> {
    const app = await this.getApp()

    const walletAddressDerivationPaths = []
    for (const address of addresses) {
      const walletAddress = await this.getWalletAddress(address)
      walletAddressDerivationPaths.push(walletAddress.derivationPath)
    }

    if (!segwit) {
      for (const input of inputs) {
        tx.setInputScript(input.vout.n, input.outputScript)
      }
    }

    const ledgerTx = await app.splitTransaction(tx.toHex(), true)
    const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex')

    const ledgerInputs = []
    for (const input of inputs) {
      const ledgerInputTx = await app.splitTransaction(input.inputTxHex, true)
      ledgerInputs.push([ledgerInputTx, input.index, input.outputScript.toString('hex'), 0])
    }

    const ledgerSigs = await app.signP2SHTransaction({
      // @ts-ignore
      inputs: ledgerInputs,
      sigHashType: this._network.protocolType == ProtocolType.BitcoinCash ? 0x41 : 0x01,
      associatedKeysets: walletAddressDerivationPaths,
      outputScriptHex: ledgerOutputs,
      lockTime,
      segwit,
      transactionVersion: 2
    })

    const finalLedgerSigs = []
    for (const ledgerSig of ledgerSigs) {
      const finalSig = segwit
        ? ledgerSig
        : ledgerSig + (this._network.protocolType == ProtocolType.BitcoinCash ? '41' : '01')
      finalLedgerSigs.push(Buffer.from(finalSig, 'hex'))
    }

    return finalLedgerSigs
  }

  getAmountBuffer(amount: number) {
    let hexAmount = new BigNumber(Math.round(amount)).toString(16)
    hexAmount = padHexStart(hexAmount, 8)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async getLedgerInputs(unspentOutputs: { txid: string; vout: number }[]) {
    const app = await this.getApp()

    return Promise.all(
      unspentOutputs.map(async (utxo) => {
        const hex = await this.getMethod('getTransactionHex')(utxo.txid)
        const tx = await app.splitTransaction(hex, true)
        return [tx, utxo.vout, undefined, 0]
      })
    )
  }

  async _getWalletPublicKey(path: string) {
    const app = await this.getApp()
    const format = this._addressType === bitcoin.AddressType.P2SH_SEGWIT ? 'p2sh' : this._addressType
    return app.getWalletPublicKey(path, { format })
  }

  async getWalletPublicKey(path: string) {
    if (path in this._walletPublicKeyCache) {
      return this._walletPublicKeyCache[path]
    }

    const walletPublicKey = await this._getWalletPublicKey(path)
    this._walletPublicKeyCache[path] = walletPublicKey
    return walletPublicKey
  }

  async baseDerivationNode() {
    if (this._baseDerivationNode) return this._baseDerivationNode

    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    this._baseDerivationNode = fromPublicKey(
      Buffer.from(compressedPubKey, 'hex'),
      Buffer.from(walletPubKey.chainCode, 'hex'),
      this._network
    )
    return this._baseDerivationNode
  }

  async getConnectedNetwork() {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const network = getAddressNetwork(walletPubKey.bitcoinAddress)

    let inferredNetwork
    // Bitcoin Ledger app does not distinguish between regtest & testnet
    if (
      this._network.name === BitcoinNetworks.bitcoin_regtest.name &&
      network.name === BitcoinNetworks.bitcoin_testnet.name
    ) {
      inferredNetwork = BitcoinNetworks.bitcoin_regtest
    } else inferredNetwork = network

    if (this._network.protocolType == ProtocolType.BitcoinCash) {
      switch (inferredNetwork.name) {
        case 'bitcoin_mainnet':
          return BitcoinCashNetworks.bitcoin_cash
        case 'bitcoin_testnet':
          return BitcoinCashNetworks.bitcoin_cash_testnet
        case 'bitcoin_regtest':
          return BitcoinCashNetworks.bitcoin_cash_regtest
      }
    }
  }
}
