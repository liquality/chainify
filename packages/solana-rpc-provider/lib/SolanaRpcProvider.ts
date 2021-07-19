import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import {
  BigNumber,
  ChainProvider,
  Address,
  Block,
  Transaction,
  solana,
  FeeDetails,
  FeeProvider
} from '@liquality/types'
import { SolanaNetwork } from '@liquality/solana-networks'
import { TxNotFoundError } from '@liquality/errors'
import { normalizeBlock, normalizeTransaction } from '@liquality/solana-utils'

import {
  Connection,
  PublicKey,
  AccountInfo,
  sendAndConfirmTransaction,
  Transaction as SolTransaction,
  Keypair,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  ConfirmedSignatureInfo,
  Signer
} from '@solana/web3.js'

import { addressToString } from '@liquality/utils'

export default class SolanaRpcProvider extends NodeProvider implements FeeProvider, Partial<ChainProvider> {
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

  async getBlockByHash(): Promise<Block> {
    throw new Error('Method not implemented.')
  }

  async getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block> {
    const block = await this.connection.getBlock(blockNumber)

    const normalizedBlock = normalizeBlock(block)

    if (!includeTx) {
      return normalizedBlock
    }

    normalizedBlock.transactions = await this._includeTransactions(blockNumber)
    return normalizedBlock
  }

  async getBlockHeight(): Promise<number> {
    return await this.connection.getSlot()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction> {
    const [tx, signatureStatus] = await Promise.all([
      this.connection.getParsedConfirmedTransaction(txHash),
      this.connection.getSignatureStatus(txHash, { searchTransactionHistory: true })
    ])

    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    return normalizeTransaction(tx, signatureStatus)
  }

  async getTransactionReceipt(txHashes: string[]): Promise<Transaction<solana.InputTransaction>[]> {
    const transactions = await this.connection.getParsedConfirmedTransactions(txHashes)

    if (!transactions) {
      return []
    }

    return transactions.map((transaction) => normalizeTransaction(transaction))
  }

  async getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    const promiseBalances = await Promise.all(
      addresses.map(async (address) => {
        try {
          const publicKey = new PublicKey(addressToString(address))

          const balance = await this.connection.getBalance(publicKey)

          return new BigNumber(balance)
        } catch (err) {
          if (err?.message?.includes('does not exist while viewing')) {
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
    const wireTransaciton = Buffer.from(rawTransaction)
    return await this.connection.sendRawTransaction(wireTransaciton)
  }

  async getRecentBlockhash() {
    return this.connection.getRecentBlockhash()
  }

  async _getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    return await this.connection.getMinimumBalanceForRentExemption(dataLength)
  }

  async _sendAndConfirmTransaction(transaction: SolTransaction, accounts: Array<Signer>): Promise<string> {
    return await sendAndConfirmTransaction(this.connection, transaction, accounts)
  }

  async _getAddressHistory(address: string): Promise<ConfirmedSignatureInfo[]> {
    return await this.connection.getConfirmedSignaturesForAddress2(new PublicKey(addressToString(address)))
  }

  async _includeTransactions(blockNumber: number): Promise<Transaction[]> {
    const confirmedSignatures = await this.connection.getConfirmedBlockSignatures(blockNumber)

    const blockTransactions = confirmedSignatures.signatures.map((signature) => this.getTransactionByHash(signature))

    return await Promise.all(blockTransactions)
  }

  async _deploy(signer: Keypair, bytecode: number[]): Promise<string> {
    const programAccount = new Keypair()

    await BpfLoader.load(this.connection, signer, programAccount, bytecode, BPF_LOADER_PROGRAM_ID)

    return programAccount.publicKey.toString()
  }

  async _getAccountInfo(address: string): Promise<AccountInfo<Buffer>> {
    return this.connection.getAccountInfo(new PublicKey(address))
  }

  async _waitForContractToBeExecutable(programId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const accountInfo = await this._getAccountInfo(programId)

        if (accountInfo.executable) {
          clearInterval(interval)
          resolve(true)
        }
      }, 5000)
    })
  }

  async getFees(): Promise<FeeDetails> {
    const { feeCalculator } = await this.getRecentBlockhash()
    return {
      slow: {
        fee: feeCalculator.lamportsPerSignature
      },
      average: {
        fee: feeCalculator.lamportsPerSignature
      },
      fast: {
        fee: feeCalculator.lamportsPerSignature
      }
    }
  }
}
