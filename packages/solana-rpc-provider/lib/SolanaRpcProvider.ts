import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction, solana } from '@liquality/types'
import { SolanaNetwork } from '@liquality/solana-network'
import { TxNotFoundError } from '@liquality/errors'

import filter from 'lodash/filter'

import {
  Connection,
  PublicKey,
  ParsedConfirmedTransaction,
  AccountInfo,
  sendAndConfirmTransaction,
  Transaction as SolTransaction,
  Keypair,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  ConfirmedSignatureInfo
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

  async getBlockHeight(): Promise<number> {
    return await this.connection.getSlot()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    const tx = await this.connection.getParsedConfirmedTransaction(txHash)

    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    return this._normalizeTransaction(tx)
  }

  async getParsedAndConfirmedTransactions(txHashes: string[]): Promise<Transaction<solana.InputTransaction>[]> {
    const transactions = await this.connection.getParsedConfirmedTransactions(txHashes)

    return transactions.map((transaction) => this._normalizeTransaction(transaction))
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

  async sendSweepTransaction(address: string | Address, fee?: number): Promise<Transaction<any>> {
    const sender = await this.getMethod('getUnusedAddress')()

    const [balance, blockHash] = await Promise.all([
      this.getBalance([sender.address]),
      this.connection.getRecentBlockhash()
    ])

    const _fee = blockHash.feeCalculator.lamportsPerSignature

    return await this.getMethod('sendTransaction')({
      to: address,
      value: balance.minus(_fee)
    })
  }

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
    return await this.connection.getProgramAccounts(new PublicKey(programId))
  }

  async getAccountInfo(address: string): Promise<AccountInfo<Buffer>> {
    return await this.connection.getAccountInfo(new PublicKey(address))
  }

  async getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    return await this.connection.getMinimumBalanceForRentExemption(dataLength)
  }

  async sendAndConfirmTransaction(transaction: SolTransaction, accounts: any[]): Promise<string> {
    return await sendAndConfirmTransaction(this.connection, transaction, accounts)
  }

  async getAddressHistory(address: string): Promise<ConfirmedSignatureInfo[]> {
    return await this.connection.getConfirmedSignaturesForAddress2(new PublicKey(address))
  }

  async _includeTransactions(blockNumber: number): Promise<Transaction<any>[]> {
    const confirmedSignatures = await this.connection.getConfirmedBlockSignatures(blockNumber)

    const blockTransactions = confirmedSignatures.signatures.map((signature) => this.getTransactionByHash(signature))

    return await Promise.all(blockTransactions)
  }

  async _deploy(signer: any, bytecode: any): Promise<string> {
    const programAccount = new Keypair()

    await BpfLoader.load(this.connection, signer, programAccount, bytecode, BPF_LOADER_PROGRAM_ID)

    return programAccount.publicKey.toString()
  }

  async _getAccountInfo(address: string): Promise<AccountInfo<Buffer>> {
    return this.connection.getAccountInfo(new PublicKey(address))
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

  _normalizeTransaction(tx: ParsedConfirmedTransaction): Transaction<solana.InputTransaction> {
    const {
      transaction: {
        message: { accountKeys, instructions },
        signatures
      }
    } = tx

    const [hash] = signatures
    const [firstInstruction] = instructions as any

    const transactionData: any = {
      lamports: 0,
      programId: ''
    }

    const txData = filter(instructions as any, 'data')

    let deserialized

    if (txData.length) {
      deserialized = this.getMethod('_deserialize')(txData[0].data)

      transactionData._raw = { ...transactionData._raw, ...deserialized }

      if (deserialized.secret) {
        transactionData.secret = deserialized.secret
      }
    }

    if (firstInstruction.parsed) {
      transactionData.lamports = firstInstruction.parsed.info.lamports
    }

    transactionData.programId = accountKeys[accountKeys.length - 1].pubkey.toString()

    return {
      hash,
      value: transactionData.lamports,
      secret: transactionData.secret,
      _raw: {
        programId: transactionData.programId,
        ...transactionData._raw
      }
    }
  }
}
