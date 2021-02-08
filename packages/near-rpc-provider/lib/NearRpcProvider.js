import NodeProvider from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'

import { providers, Account } from 'near-api-js'
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
    return this._jsonRpc.sendJsonRpc('broadcast_tx_commit', [hash])
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

  async getTransactionByHash (txHash, accoutnId) {
    return this._jsonRpc.sendJsonRpc('tx', [txHash, accoutnId])
  }

  async getTransactionReceipt (txHash, accountId) {
    return this._jsonRpc.sendJsonRpc('EXPERIMENTAL_tx_status', [
      txHash,
      accountId
    ])
  }

  async getGasPrice () {
    const result = await this._jsonRpc.sendJsonRpc('gas_price', [null])
    return get(result, 'gas_price')
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [addresses]
    }

    const promiseBalances = await Promise.all(
      addresses.map((address) =>
        this._jsonRpc.query({
          request_type: 'view_account',
          finality: 'final',
          account_id: addressToString(address)
        })
      )
    )

    return promiseBalances
      .map((balance) => {
        const costPerByte = new BigNumber(1)
        const stateStaked = new BigNumber(balance.storage_usage).multipliedBy(
          costPerByte
        )
        const staked = new BigNumber(balance.locked)
        const totalBalance = new BigNumber(balance.amount).plus(staked)
        const availableBalance = totalBalance.minus(
          BigNumber.max(staked, stateStaked)
        )
        return new BigNumber(availableBalance)
      })
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
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

  async getAccount (accountId, signer) {
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
