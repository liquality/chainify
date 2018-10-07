import { flatten } from 'lodash'
import { BigNumber } from 'bignumber.js'
import { base58, padHexStart } from '../../crypto'
import { pubKeyToAddress, addressToPubKeyHash } from './BitcoinUtil'
import Address from '../../Address'
import networks from '../../networks'
import JsonRpcProvider from '../JsonRpcProvider'

 export default class BitcoinRPCWalletProvider extends JsonRpcProvider {
  async signMessage (message, from) {
    return this.jsonrpc('signmessage', from, message)
  }

  async getAddresses (startingIndex = 0, numAddresses = 1) {
    const addressGroupings = await this.jsonrpc('listaddressgroupings')
    let addresses = addressGroupings.map((addressGroup) => addressGroup[0][0])
    const lastIndex = (startingIndex + numAddresses) > addresses.length ? addresses.length : (startingIndex + numAddresses)
    return addresses.splice(startingIndex, lastIndex)
  }

  async getUnusedAddress (from = {}) {
    return this.jsonrpc('getrawchangeaddress', 'legacy')
  }

  async getAddressUTXOS (address) {
    debugger
    return this.jsonrpc('getaddressutxos', [ address ])
  }

  async getAddressTxHexs (address) {
    debugger
    const utxos = await this.getMethod('getUnspentTransactions')(address)
    debugger
    let txhexs = []
    const txHexs = await Promise.all(utxos.map(async utxo => {
      return this.getMethod('decodeRawTransaction')(utxo.txid)
    }))
    debugger
    return txHexs
  }

  calculateFee (numInputs, numOutputs, feePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * feePerByte
  }

  async createRawTransaction (txid, voutIndex, address, amount) {
    const inputs = [{ txid: txid, vout: voutIndex}]
    const outputs = { [address]: amount }
    return this.jsonrpc('createrawtransaction', inputs, outputs)
  }

  async signRawTransaction (rawTransaction) {
    return this.jsonrpc('signrawtransaction', rawTransaction)
  }

  async sendTransaction (to, value, data, from) {
    if (data) {
      const scriptPubKey = padHexStart(data)
      to = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    }
    const amount = value / 1e8
    return this.jsonrpc('sendtoaddress', to, amount)
  }
}
