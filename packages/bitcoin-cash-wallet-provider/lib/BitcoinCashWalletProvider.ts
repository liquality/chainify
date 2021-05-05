import { selectCoins, normalizeTransactionObject, decodeRawTransaction, bitcoreCash, bitcoreNetworkName } from '../../bitcoin-cash-utils' // '@liquality/bitcoin-cash-utils'
import { BitcoinCashNetwork } from '../../bitcoin-cash-networks'//'@liquality/bitcoin-cash-networks'
import { bitcoinCash, Address, BigNumber, SendOptions, ChainProvider, WalletProvider } from '@liquality/types'
import { asyncSetImmediate, addressToString } from '@liquality/utils'
import { Provider } from '@liquality/provider'
import { InsufficientBalanceError } from '@liquality/errors'

import { BIP32Interface, payments } from 'bitcoinjs-lib'

const ADDRESS_GAP = 20

export enum AddressSearchType {
  EXTERNAL,
  CHANGE,
  EXTERNAL_OR_CHANGE
}

type DerivationCache = { [index: string]: Address }

type Constructor<T = unknown> = new (...args: any[]) => T

interface BitcoinCashWalletProviderOptions {
  network: BitcoinCashNetwork
}

export default <T extends Constructor<Provider>>(superclass: T) => {
  abstract class BitcoinCashWalletProvider extends superclass implements Partial<ChainProvider>, Partial<WalletProvider> {
    _baseDerivationPath: string
    _network: BitcoinCashNetwork
    _derivationCache: DerivationCache

    constructor(...args: any[]) {
      const options = args[0] as BitcoinCashWalletProviderOptions
      const { network } = options

      const baseDerivationPath = `44'/${network.coinType}'/0'`

      super(options)

      this._baseDerivationPath = baseDerivationPath
      this._network = network
      this._derivationCache = {}
    }

    abstract baseDerivationNode(): Promise<BIP32Interface>
    abstract _buildTransaction(
      targets: bitcoinCash.OutputTarget[],
      feePerByte?: number,
      fixedInputs?: bitcoinCash.Input[]
    ): Promise<{ hex: string; fee: number }>
    abstract _buildSweepTransaction(
      externalChangeAddress: string,
      feePerByte?: number
    ): Promise<{ hex: string; fee: number }>
    abstract sweepSwapOutput(
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
    ): Promise<string>
    abstract signBatchP2SHTransaction(
      inputs: [{ inputTxHex: string; index: number; vout: any; outputScript: Buffer }],
      addresses: string,
      tx: any,
      lockTime?: number,
      segwit?: boolean
    ): Promise<Buffer[]>

    getDerivationCache() {
      return this._derivationCache
    }

    sendOptionsToOutputs(transactions: SendOptions[]): bitcoinCash.OutputTarget[] {
      return transactions.map((tx) => ({
        address: addressToString(tx.to),
        value: tx.value.toNumber()
      }))
    }

    async setDerivationCache(derivationCache: DerivationCache) {
      const address = await this.getDerivationPathAddress(Object.keys(derivationCache)[0])
      if (derivationCache[address.derivationPath].address !== address.address) {
        throw new Error(`derivationCache at ${address.derivationPath} does not match`)
      }
      this._derivationCache = derivationCache
    }

    async buildTransaction(output: bitcoinCash.OutputTarget, feePerByte: number) {
      return this._buildTransaction([output], feePerByte)
    }

    async buildBatchTransaction(outputs: bitcoinCash.OutputTarget[]) {
      return this._buildTransaction(outputs)
    }

    async _sendTransaction(transactions: bitcoinCash.OutputTarget[], feePerByte?: number) {
      const { hex, fee } = await this._buildTransaction(transactions, feePerByte)
      await this.getMethod('sendRawTransaction')(hex)
      return normalizeTransactionObject(decodeRawTransaction(hex, this._network), fee)
    }

    async sendTransaction(options: SendOptions) {
      return this._sendTransaction(this.sendOptionsToOutputs([options]), options.fee)
    }

    async sendBatchTransaction(transactions: SendOptions[]) {
      return this._sendTransaction(this.sendOptionsToOutputs(transactions))
    }

    async buildSweepTransaction(externalChangeAddress: string, feePerByte: number) {
      return this._buildSweepTransaction(externalChangeAddress, feePerByte)
    }

    async sendSweepTransaction(externalChangeAddress: Address | string, feePerByte: number) {
      const { hex, fee } = await this._buildSweepTransaction(addressToString(externalChangeAddress), feePerByte)
      await this.getMethod('sendRawTransaction')(hex)
      return normalizeTransactionObject(decodeRawTransaction(hex, this._network), fee)
    }

    async findAddress(addresses: string[], change = false) {
      // A maximum number of addresses to lookup after which it is deemed that the wallet does not contain this address
      const maxAddresses = 5000
      const addressesPerCall = 50
      let index = 0
      while (index < maxAddresses) {
        const walletAddresses = await this.getAddresses(index, addressesPerCall, change)
        const walletAddress = walletAddresses.find((walletAddr) =>
          addresses.find((addr) => walletAddr.address === addr)
        )
        if (walletAddress) return walletAddress
        index += addressesPerCall
      }
    }

    async getWalletAddress(address: string) {
      const externalAddress = await this.findAddress([address], false)
      if (externalAddress) return externalAddress
      const changeAddress = await this.findAddress([address], true)
      if (changeAddress) return changeAddress

      throw new Error('Wallet does not contain address')
    }

    getAddressFromPublicKey(publicKey: Buffer) {
      const oldAddress = this.getPaymentVariantFromPublicKey(publicKey).address
      // Do not directly convert - regtest and testnet are different in CashAddr
      return bitcoreCash.Script.buildPublicKeyHashOut(
        new bitcoreCash.Address(oldAddress)
      ).toAddress(bitcoreNetworkName(this._network)).toString()
    }

    getPaymentVariantFromPublicKey(publicKey: Buffer) {
      return payments.p2pkh({ pubkey: publicKey, network: this._network })
    }

    async importAddresses() {
      const change = await this.getAddresses(0, 200, true)
      const nonChange = await this.getAddresses(0, 200, false)
      const all = [...nonChange, ...change].map((address) => address.address)
      await this.getMethod('importAddresses')(all)
    }

    async getDerivationPathAddress(path: string) {
      if (path in this._derivationCache) {
        return this._derivationCache[path]
      }

      const baseDerivationNode = await this.baseDerivationNode()
      const subPath = path.replace(this._baseDerivationPath + '/', '')
      const publicKey = baseDerivationNode.derivePath(subPath).publicKey
      const address = this.getAddressFromPublicKey(publicKey)
      const addressObject = new Address({
        address,
        publicKey: publicKey.toString('hex'),
        derivationPath: path
      })

      this._derivationCache[path] = addressObject
      return addressObject
    }

    async getAddresses(startingIndex = 0, numAddresses = 1, change = false) {
      if (numAddresses < 1) {
        throw new Error('You must return at least one address')
      }

      const addresses = []
      const lastIndex = startingIndex + numAddresses
      const changeVal = change ? '1' : '0'

      for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
        const subPath = changeVal + '/' + currentIndex
        const path = this._baseDerivationPath + '/' + subPath
        const addressObject = await this.getDerivationPathAddress(path)
        addresses.push(addressObject)

        await asyncSetImmediate()
      }

      return addresses
    }

    async _getUsedUnusedAddresses(numAddressPerCall = 100, addressType: AddressSearchType) {
      const usedAddresses = []
      const addressCountMap = { change: 0, external: 0 }
      const unusedAddressMap: { change: Address; external: Address } = { change: null, external: null }

      let addrList: Address[]
      let addressIndex = 0
      let changeAddresses: Address[] = []
      let externalAddresses: Address[] = []

      /* eslint-disable no-unmodified-loop-condition */
      while (
        (addressType === AddressSearchType.EXTERNAL_OR_CHANGE &&
          (addressCountMap.change < ADDRESS_GAP || addressCountMap.external < ADDRESS_GAP)) ||
        (addressType === AddressSearchType.EXTERNAL && addressCountMap.external < ADDRESS_GAP) ||
        (addressType === AddressSearchType.CHANGE && addressCountMap.change < ADDRESS_GAP)
      ) {
        /* eslint-enable no-unmodified-loop-condition */
        addrList = []

        if (
          (addressType === AddressSearchType.EXTERNAL_OR_CHANGE || addressType === AddressSearchType.CHANGE) &&
          addressCountMap.change < ADDRESS_GAP
        ) {
          // Scanning for change addr
          changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
          addrList = addrList.concat(changeAddresses)
        } else {
          changeAddresses = []
        }

        if (
          (addressType === AddressSearchType.EXTERNAL_OR_CHANGE || addressType === AddressSearchType.EXTERNAL) &&
          addressCountMap.external < ADDRESS_GAP
        ) {
          // Scanning for non change addr
          externalAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
          addrList = addrList.concat(externalAddresses)
        }

        const transactionCounts: bitcoinCash.AddressTxCounts = await this.getMethod('getAddressTransactionCounts')(addrList)

        for (const address of addrList) {
          const isUsed = transactionCounts[address.address] > 0
          const isChangeAddress = changeAddresses.find((a) => address.address === a.address)
          const key = isChangeAddress ? 'change' : 'external'

          if (isUsed) {
            usedAddresses.push(address)
            addressCountMap[key] = 0
            unusedAddressMap[key] = null
          } else {
            addressCountMap[key]++

            if (!unusedAddressMap[key]) {
              unusedAddressMap[key] = address
            }
          }
        }

        addressIndex += numAddressPerCall
      }

      return {
        usedAddresses,
        unusedAddress: unusedAddressMap
      }
    }

    async getUsedAddresses(numAddressPerCall = 100) {
      return this._getUsedUnusedAddresses(numAddressPerCall, AddressSearchType.EXTERNAL_OR_CHANGE).then(
        ({ usedAddresses }) => usedAddresses
      )
    }

    async getUnusedAddress(change = false, numAddressPerCall = 100) {
      const addressType = change ? AddressSearchType.CHANGE : AddressSearchType.EXTERNAL
      const key = change ? 'change' : 'external'
      return this._getUsedUnusedAddresses(numAddressPerCall, addressType).then(
        ({ unusedAddress }) => unusedAddress[key]
      )
    }

    async getInputsForAmount(
      _targets: bitcoinCash.OutputTarget[],
      feePerByte?: number,
      fixedInputs: bitcoinCash.Input[] = [],
      numAddressPerCall = 100,
      sweep = false
    ) {
      let addressIndex = 0
      let changeAddresses: Address[] = []
      let externalAddresses: Address[] = []
      const addressCountMap = {
        change: 0,
        nonChange: 0
      }

      const feePerBytePromise = this.getMethod('getFeePerByte')()
      let utxos: bitcoinCash.UTXO[] = []

      while (addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP) {
        let addrList: Address[] = []

        if (addressCountMap.change < ADDRESS_GAP) {
          // Scanning for change addr
          changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
          addrList = addrList.concat(changeAddresses)
        } else {
          changeAddresses = []
        }

        if (addressCountMap.nonChange < ADDRESS_GAP) {
          // Scanning for non change addr
          externalAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
          addrList = addrList.concat(externalAddresses)
        }

        const fixedUtxos: bitcoinCash.UTXO[] = []
        if (fixedInputs.length > 0) {
          for (const input of fixedInputs) {
            const txHex = await this.getMethod('getRawTransactionByHash')(input.txid)
            const tx = decodeRawTransaction(txHex, this._network)
            const value = new BigNumber(tx.vout[input.vout].value).times(1e8).toNumber()
            const address = tx.vout[input.vout].scriptPubKey.addresses[0]
            const walletAddress = await this.getWalletAddress(address)
            const utxo = { ...input, value, address, derivationPath: walletAddress.derivationPath }
            fixedUtxos.push(utxo)
          }
        }

        if (!sweep || fixedUtxos.length === 0) {
          const _utxos: bitcoinCash.UTXO[] = await this.getMethod('getUnspentTransactions')(addrList)
          utxos.push(
            ..._utxos.map((utxo) => {
              const addr = addrList.find((a) => a.address === utxo.address)
              return {
                ...utxo,
                derivationPath: addr.derivationPath
              }
            })
          )
        } else {
          utxos = fixedUtxos
        }

        const utxoBalance = utxos.reduce((a, b) => a + (b.value || 0), 0)

        const transactionCounts: bitcoinCash.AddressTxCounts = await this.getMethod('getAddressTransactionCounts')(addrList)

        if (!feePerByte) feePerByte = await feePerBytePromise
        const minRelayFee = await this.getMethod('getMinRelayFee')()
        if (feePerByte < minRelayFee) {
          throw new Error(`Fee supplied (${feePerByte} sat/b) too low. Minimum relay fee is ${minRelayFee} sat/b`)
        }

        let targets
        if (sweep) {
          const outputBalance = _targets.reduce((a, b) => a + (b['value'] || 0), 0)

          const amountToSend = new BigNumber(utxoBalance).minus(
            feePerByte * ((_targets.length + 1) * 39 + utxos.length * 153)
          ) // todo better calculation

          targets = _targets.map((target) => ({ id: 'main', value: target.value }))
          targets.push({ id: 'main', value: amountToSend.minus(outputBalance).toNumber() })
        } else {
          targets = _targets.map((target) => ({ id: 'main', value: target.value }))
        }

        const { inputs, outputs, change, fee } = selectCoins(utxos, targets, Math.ceil(feePerByte), fixedUtxos)

        if (inputs && outputs) {
          return {
            inputs,
            change,
            outputs,
            fee
          }
        }

        for (const address of addrList) {
          const isUsed = transactionCounts[address.address]
          const isChangeAddress = changeAddresses.find((a) => address.address === a.address)
          const key = isChangeAddress ? 'change' : 'nonChange'

          if (isUsed) {
            addressCountMap[key] = 0
          } else {
            addressCountMap[key]++
          }
        }

        addressIndex += numAddressPerCall
      }

      throw new InsufficientBalanceError('Not enough balance')
    }
  }
  return BitcoinCashWalletProvider
}
