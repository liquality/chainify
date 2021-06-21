import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction, solana } from '@liquality/types'
import { SolanaNetwork } from '@liquality/solana-network'

import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction as SolTransaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  ParsedConfirmedTransaction,
  AccountInfo
} from '@solana/web3.js'

export default class SolanaRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: SolanaNetwork
  connection: Connection

  constructor(network: SolanaNetwork) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this.connection = new Connection(network.nodeUrl)
    this._network = network
  }

  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 20000))
  }

  // getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any>> {
  //   throw new Error('Method not implemented.')
  // }

  async getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block<any>> {
    const block = await this.connection.getBlock(blockNumber)

    const normalizedBlock = this._normalizeBlock(block as any)

    if (!includeTx) {
      return normalizedBlock
    }

    normalizedBlock.transactions = await this._includeTransactions(blockNumber)

    return normalizedBlock
  }

  getBlockHeight(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    const tx = await this.connection.getParsedConfirmedTransaction(txHash)

    return this._normalizeTransaction(tx)
  }

  async getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    const promiseBalances = await Promise.all(
      addresses.map(async (address) => {
        try {
          const publicKey = new PublicKey(address)
          const balance = await this.connection.getBalance(publicKey)
          return new BigNumber(balance)
        } catch (err) {
          if (err.message && err.message.includes('does not exist while viewing')) {
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

  // Promise<Transaction<any>>
  async sendTransaction(options: solana.SolanaSendOptions): Promise<any> {
    const instructions: TransactionInstruction[] = []

    const signer = options.signer

    if (!options.data) {
      const to = new PublicKey(options.to)
      const lamports = Number(options.value)

      instructions.push(this._sendBetweenAccounts(signer, to, lamports))
    }

    const transaction = new SolTransaction()

    instructions.forEach((instruction) => transaction.add(instruction))

    return await sendAndConfirmTransaction(this.connection, transaction, [options.signer])
  }

  // sendSweepTransaction(address: string | Address, fee?: number): Promise<Transaction<any>> {
  //   throw new Error('Method not implemented.')
  // }
  // updateTransactionFee(tx: string | Transaction<any>, newFee: number): Promise<Transaction<any>> {
  //   throw new Error('Method not implemented.')
  // }
  // sendBatchTransaction(transactions: SendOptions[]): Promise<Transaction<any>> {
  //   throw new Error('Method not implemented.')
  // }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    const wireTransaciton = Buffer.from(rawTransaction)
    return await this.connection.sendRawTransaction(wireTransaciton)
  }

  async getProgramAccounts(programId: PublicKey): Promise<
    {
      pubkey: PublicKey
      account: AccountInfo<Buffer>
    }[]
  > {
    return await this.connection.getProgramAccounts(programId)
  }

  async getAccountInfo(pubkey: PublicKey): Promise<AccountInfo<Buffer>> {
    return await this.connection.getAccountInfo(pubkey)
  }

  async getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    return await this.connection.getMinimumBalanceForRentExemption(dataLength)
  }

  _sendBetweenAccounts(signer: Keypair, recepient: PublicKey, lamports: number): TransactionInstruction {
    return SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: recepient,
      lamports
    })
  }

  _normalizeBlock(block: solana.SolanaBlock): Block {
    return {
      hash: block.blockhash,
      number: block.parentSlot + 1,
      parentHash: block.previousBlockhash,
      size: block.blockHeight,
      timestamp: block.blockTime,
      transactions: []
    }
  }

  _normalizeTransaction(tx: ParsedConfirmedTransaction): Transaction {
    const {
      transaction: {
        message: { instructions },
        signatures
      }
    } = tx

    const [hash] = signatures
    const [instruction] = instructions as any

    let lamports = 0

    if (instruction.parsed) {
      lamports = instruction.parsed.info.lamports
    }

    return {
      hash,
      value: lamports,
      _raw: {}
    }
  }

  async _includeTransactions(blockNumber: number): Promise<Transaction<any>[]> {
    const confirmedSignatures = await this.connection.getConfirmedBlockSignatures(blockNumber)

    const blockTransactions = confirmedSignatures.signatures.map((signature) => this.getTransactionByHash(signature))

    return await Promise.all(blockTransactions)
  }
}
