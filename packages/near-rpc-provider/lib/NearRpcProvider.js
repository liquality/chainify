import NodeProvider from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'

import { providers, Account, transactions } from 'near-api-js'
import { get, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { version } from '../package.json'

export default class NearRpcProvider extends NodeProvider {
  constructor (network) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._jsonRpc = new providers.JsonRpcProvider(network.nodeUrl)
    this._network = network
    this._usedAddressCache = {}
    this._accountsCache = {}
  }

  async sendRawTransaction (hash) {
    const result = await this._jsonRpc.sendJsonRpc('broadcast_tx_commit', [
      hash
    ])
    // TODO: normalize tx result
    return result
  }

  async sendTransaction (to, value, actions, _gasPrice) {
    const addresses = await this.getAddresses()
    const signer = this.getMethod('getSigner')()
    const from = this.getAccount(addresses[0].address, signer)

    if (!actions) {
      actions = [transactions.transfer(value)]
    }

    const [, signedTx] = await from.signTransaction(to, actions)
    const rawSignedTx = signedTx.encode().toString('base64')
    const result = await this.getMethod('sendRawTransaction')(rawSignedTx)
    // TODO: normalize transaction
    return result
  }

  async _getBlockById (blockId, includeTx) {
    const block = await this._jsonRpc.block({ blockId })

    if (includeTx && !block.transactions && isArray(block.chunks)) {
      const chunks = await Promise.all(
        block.chunks.map((c) => this._jsonRpc.chunk(c.chunk_hash))
      )

      const transactions = chunks.reduce((p, c) => {
        p.push(...c.transactions)
        return p
      }, [])

      return { ...block, transactions }
    }

    return block
  }

  async getBlockByHash (blockHash, includeTx) {
    return this._getBlockById(blockHash, includeTx)
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this._getBlockById(blockNumber, includeTx)
  }

  async getBlockHeight () {
    const result = await this._jsonRpc.block({ finality: 'final' })
    return get(result, 'header.height')
  }

  async getTransactionByHash (txHash) {
    const args = txHash.split('_')
    return this._jsonRpc.sendJsonRpc('tx', args)
  }

  async getTransactionReceipt (txHash) {
    const args = txHash.split('_')
    return this._jsonRpc.sendJsonRpc('EXPERIMENTAL_tx_status', args)
  }

  async getGasPrice () {
    const result = await this._jsonRpc.sendJsonRpc('gas_price', [null])
    return get(result, 'gas_price')
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [addresses]
    }
    const balance = await this.getAccount(addresses[0]).getAccountBalance()
    return new BigNumber(balance.available)
  }

  async isAddressUsed (address) {
    address = addressToString(address)

    if (this._usedAddressCache[address]) {
      return true
    }

    const activity = await this.getAccountActivity(address)
    const isUsed = activity.length > 0

    if (isUsed) {
      this._usedAddressCache[address] = true
    }

    return isUsed
  }

  getAccount (accountId, signer) {
    return new Account(
      {
        networkId: this._network.networkId,
        provider: this._jsonRpc,
        signer
      },
      accountId
    )
  }

  async getAccounts (publicKey, index) {
    if (this._accountsCache[index]) {
      return this._accountsCache[index]
    }

    const accounts = await this.nodeGet(
      `/publicKey/${publicKey.toString()}/accounts`
    )

    if (accounts[index]) {
      this._accountsCache[index] = accounts[index]
      return accounts[index]
    }

    throw new Error(`Account with index ${index} not found`)
  }

  async getAccountActivity (accountId, offset, limit = 10) {
    return this.nodeGet(
      `/account/${accountId}?offset=${offset}&limit=${limit}`
    )
  }

  async createAccount (newAccountId, publicKey) {
    try {
      this._jsonRpc.query(
        `account/${newAccountId}.${this._network.accountSuffix}`,
        ''
      )
      throw new Error('Account already exists.')
    } catch (e) {
      // account does not exist and we can craete it.
      return this.nodePost('/account', {
        newAccountId,
        newAccountPublicKey: publicKey.toString()
      })
    }
  }
}

NearRpcProvider.version = version
