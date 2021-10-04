import { NodeProvider as NodeProvider } from '@liquality/node-provider'
// import { BigNumber, ChainProvider, Address, Block, Transaction, SendOptions, flow } from '@liquality/types'
import { BigNumber, ChainProvider, Block, Transaction, flow } from '@liquality/types'
import { addressToString } from '@liquality/utils'

import { FlowNetwork } from '@liquality/flow-networks'
import { normalizeBlock, normalizeTx } from '@liquality/flow-utils'

import * as fcl from '@onflow/fcl'

export default class FlowRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: FlowNetwork
  _addressAPI: NodeProvider

  constructor(network: FlowNetwork) {
    super({
      baseURL: network.rpcUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._network = network

    this._addressAPI = new NodeProvider({
      baseURL: network.accountAPI,
      responseType: 'text',
      transformResponse: undefined
    })

    fcl
      .config()
      .put('accessNode.api', this._network.rpcUrl)
      .put('env', this._network.isTestnet ? 'testnet' : 'mainnet')
      .put('discovery.wallet', this._network.discoveryWallet)
  }

  // average block time is around 2.7 seconds
  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 3000))
  }

  async getBlockByHash(blockHash: string): Promise<Block<flow.Tx>> {
    const block = await fcl.send([fcl.getBlock(), fcl.atBlockId(blockHash)]).then(fcl.decode)
    const parsedBlock = await this.parseBlock(block)

    return parsedBlock
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<flow.Tx>> {
    const block = await fcl.send([fcl.getBlock(), fcl.atBlockHeight(blockNumber)]).then(fcl.decode)
    const parsedBlock = await this.parseBlock(block)

    return parsedBlock
  }

  async getBlockHeight(): Promise<number> {
    const block = await fcl.latestBlock(false)

    return block.height
  }

  async getTransactionByHash(
    txHash: string,
    blockNumber?: number,
    currentBlockHeight?: number
  ): Promise<Transaction<flow.Tx>> {
    const txRaw = await fcl.send([fcl.getTransaction(txHash)]).then(fcl.decode)
    const txAdditionaData = await fcl.tx(txHash).snapshot()

    const _currentBlockHeight = currentBlockHeight || (await this.getBlockHeight())
    const _blockNumber = blockNumber || (await this.getBlockByHash(txRaw.referenceBlockId)).number

    return normalizeTx({
      ...txRaw,
      ...txAdditionaData,
      txId: txHash,
      blockNumber: _blockNumber,
      blockConfirmations: _currentBlockHeight - _blockNumber
    })
  }

  async getBalance(addresses: string[]): Promise<BigNumber> {
    const _addresses = addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      _addresses.map(async (address: string) => {
        try {
          const account = await fcl.account(address)
          return new BigNumber(account.balance)
        } catch (err) {
          if (err.message) {
            return new BigNumber(0)
          }
          throw err
        }
      })
    )

    return promiseBalances
      .map((balance) => new BigNumber(balance))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    const txResponse = await fcl.send([fcl.script(rawTransaction)]).then(fcl.decode)

    // TODO: return correct value
    return txResponse.toString()
  }

  async accountAddress(publicKey: string): Promise<string | undefined> {
    let addr = await this.getAccountAddressFromPublicKey(publicKey)
    if (!addr) {
      addr = await this.createAccountAddressFromPublicKey(publicKey)
    }
    return addr
  }

  async createAccountAddressFromPublicKey(publicKey: string): Promise<string | undefined> {
    try {
      // By default Liquality wallet uses ECDSA_secp256k1 and SHA3_256
      const response = await this._addressAPI.nodePost('/accounts', {
        publicKey,
        signatureAlgorithm: 'ECDSA_secp256k1',
        hashAlgorithm: 'SHA3_256'
      })
      return response.address
    } catch {
      return
    }
  }

  async getAccountAddressFromPublicKey(publicKey: string): Promise<string | undefined> {
    try {
      const response = await this._addressAPI.nodeGet(`/accounts?publicKey=${publicKey}`)
      return response.address
    } catch {
      return
    }
  }

  async parseBlock(block: flow.BlockResponse): Promise<Block<flow.Tx>> {
    const promiseTxs = await Promise.all(
      block.collectionGuarantees.map(async (collectionGuarantee: any) => {
        try {
          const collection = await fcl.send([fcl.getCollection(collectionGuarantee.collectionId)]).then(fcl.decode)
          return await Promise.all(
            collection.transactionIds.map(async (transactionId: any) => {
              const txRaw: flow.Tx = await fcl.send([fcl.getTransaction(transactionId)]).then(fcl.decode)
              return txRaw
            })
          )
        } catch (err) {
          if (err.message) {
            return null
          }
          throw err
        }
      })
    )

    return normalizeBlock(block, Array.prototype.concat.apply([], promiseTxs))
  }
}
