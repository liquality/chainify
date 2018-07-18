import 'regenerator-runtime/runtime'

import _ from 'lodash'

import providers from './providers'
import BlockSchema from './schema/Block.json'
import TransactionSchema from './schema/Transaction.json'

const Ajv = require('ajv')

export default class Client {
  constructor (provider, version) {
    if (provider) this.addProvider(provider)
    if (version) this.version = version

    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(TransactionSchema)
    this.validateBlock = ajv.compile(BlockSchema)
  }

  addProvider (provider) {
    this.provider = provider
  }

  _checkMethod (method) {
    if (!this.provider) {
      throw new Error('No provider provided')
    }

    if (!_.isFunction(this.provider[method])) {
      throw new Error(`Unimplemented method: ${method}`)
    }

    if (_.isFunction(this.provider._checkMethodVersionSupport)) {
      if (!this.provider._checkMethodVersionSupport(method, this.version)) {
        throw new Error(`Method "${method}" is not supported by version "${this.version}"`)
      }
    }

    if (!_.isFunction(this.provider[method])) {
      throw new Error(`Unimplemented method: ${method}`)
    }
  }

  async generateBlock (numberOfBlocks) {
    this._checkMethod('generateBlock')

    if (!_.isNumber(numberOfBlocks)) {
      throw new Error('Invalid number of blocks to be generated')
    }

    const blockHashes = await this.provider.generateBlock(numberOfBlocks)

    if (!_.isArray(blockHashes)) {
      throw new Error('Provider returned an invalid response')
    }

    const invalidBlock = _.find(blockHashes, blockHash => !(/^[A-Fa-f0-9]+$/.test(blockHash)))

    if (invalidBlock) {
      throw new Error('Provider returned an invalid response')
    }

    return blockHashes
  }

  async getBlockByNumber (blockNumber, includeTx) {
    this._checkMethod('getBlockByNumber')

    if (!_.isNumber(blockNumber)) {
      throw new Error('Invalid Block number')
    }

    if (!_.isBoolean(includeTx)) {
      throw new Error('Second parameter should be boolean')
    }

    const block = await this.provider.getBlockByNumber(blockNumber, includeTx)

    if (!this.validateBlock(block)) {
      throw new Error('Provider returned an invalid block')
    }

    return block
  }

  async getBlockHeight () {
    this._checkMethod('getBlockHeight')

    const blockHeight = await this.provider.getBlockHeight()

    if (!_.isNumber(blockHeight)) {
      throw new Error('Provider returned an invalid block height')
    }

    return blockHeight
  }

  async getTransactionByHash (txHash) {
    this._checkMethod('getTransactionByHash')

    if (!(/^[A-Fa-f0-9]$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await this.provider.getTransactionByHash(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new Error('Provider returned an invalid transaction')
    }

    return transaction
  }
}

Client.providers = providers
Client.schemas = {
  BlockSchema,
  TransactionSchema
}
