import { BigNumber, SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { Keypair, SystemProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
import {
  doesTransactionMatchInitiation,
  createClaimBuffer,
  createInitBuffer,
  createRefundBuffer,
  validateSwapParams
} from '@liquality/solana-utils'
import { WalletError, TxNotFoundError, InvalidAddressError } from '@liquality/errors'
import { SolanaNetwork } from '@liquality/solana-networks'

export default class SolanaSwapProvider extends Provider implements Partial<SwapProvider> {
  private _network: SolanaNetwork

  constructor(network: SolanaNetwork) {
    super()
    this._network = network
  }

  async getSwapSecret(claimTxHash: string): Promise<string> {
    const transactionByHash = await this.getMethod('getTransactionByHash')(claimTxHash)

    if (!transactionByHash) {
      throw new TxNotFoundError(`Transaction with hash: ${claimTxHash} was not found`)
    }

    return transactionByHash?.secret
  }

  async initiateSwap(swapParams: SwapParams): Promise<Transaction> {
    validateSwapParams(swapParams)

    const signer = await this.getMethod('_getSigner')()

    const { programId } = this._network

    const { expiration, refundAddress, recipientAddress, value, secretHash } = swapParams

    const initBuffer = createInitBuffer({
      buyer: recipientAddress.toString(),
      seller: refundAddress.toString(),
      expiration,
      secret_hash: secretHash,
      value: value.toNumber()
    })

    const appAccount = new Keypair()
    const lamportsForRent = await this.getMethod('_getMinimumBalanceForRentExemption')(initBuffer.length)

    if (value.lt(lamportsForRent)) {
      throw new WalletError(`Invalid amount. Cannot be less than ${lamportsForRent} LAMPORTS`)
    }

    const systemAccountInstruction = this._createStorageAccountInstruction(
      signer,
      appAccount,
      value,
      initBuffer.length,
      programId
    )

    const transactionInstruction = this._createTransactionInstruction(signer, appAccount, programId, initBuffer)

    return await this.getMethod('sendTransaction')({
      instructions: [systemAccountInstruction, transactionInstruction],
      accounts: [appAccount]
    })
  }

  async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string): Promise<Transaction> {
    validateSwapParams(swapParams)

    const [{ programId }, [initTransaction]] = await Promise.all([
      this.getMethod('getConnectedNetwork')(),
      this.getMethod('getTransactionReceipt')([initiationTxHash]),
      this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)
    ])

    const { buyer, programAccount } = initTransaction._raw

    await this._checkIfProgramAccountExists(programAccount)

    const appAccount = new PublicKey(programAccount)
    const buyerAccount = new PublicKey(buyer)

    const transactionInstruction = await this._collectLamports(
      appAccount,
      buyerAccount,
      createClaimBuffer(secret),
      programId
    )

    return await this.getMethod('sendTransaction')({
      instructions: [transactionInstruction]
    })
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction> {
    validateSwapParams(swapParams)

    const [{ programId }, [initTransaction]] = await Promise.all([
      this.getMethod('getConnectedNetwork')(),
      this.getMethod('getTransactionReceipt')([initiationTxHash]),
      this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)
    ])

    const { seller, programAccount } = initTransaction._raw

    await this._checkIfProgramAccountExists(programAccount)

    const appAccount = new PublicKey(programAccount)
    const sellerAccount = new PublicKey(seller)

    const transactionInstruction = await this._collectLamports(
      appAccount,
      sellerAccount,
      createRefundBuffer(),
      programId.toString()
    )

    return await this.getMethod('sendTransaction')({
      instructions: [transactionInstruction]
    })
  }

  async fundSwap(): Promise<null> {
    return null
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    const [initTransaction] = await this.getMethod('getTransactionReceipt')([initiationTxHash])
    return doesTransactionMatchInitiation(swapParams, initTransaction._raw)
  }

  async _collectLamports(
    appAccountPubkey: PublicKey,
    recipient: PublicKey,
    data: Uint8Array,
    _programId: string
  ): Promise<TransactionInstruction> {
    const signer = await this.getMethod('_getSigner')()
    const programId = new PublicKey(_programId)

    return new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccountPubkey, isSigner: false, isWritable: true },
        { pubkey: recipient, isSigner: false, isWritable: true }
      ],
      programId,
      data: Buffer.from(data)
    })
  }

  _createStorageAccountInstruction(
    signer: Keypair,
    appAccount: Keypair,
    lamports: BigNumber,
    space: number,
    _programId: string
  ): TransactionInstruction {
    const newAccountPubkey = appAccount.publicKey
    const programId = new PublicKey(_programId)

    return SystemProgram.createAccount({
      fromPubkey: signer.publicKey,
      newAccountPubkey,
      lamports: lamports.toNumber(),
      space,
      programId
    })
  }

  _createTransactionInstruction = (
    signer: Keypair,
    appAccount: Keypair,
    _programId: string,
    data: Uint8Array
  ): TransactionInstruction => {
    const programId = new PublicKey(_programId)

    const transaction = new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccount.publicKey, isSigner: false, isWritable: true }
      ],
      programId,
      data: Buffer.from(data)
    })

    return transaction
  }

  async _checkIfProgramAccountExists(programAccount: string): Promise<boolean> {
    const isExisting = await this.getMethod('_getAccountInfo')(programAccount)

    if (!isExisting) {
      throw new InvalidAddressError('AccountDoesNotExist')
    }

    return isExisting
  }
}
