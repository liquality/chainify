import { BigNumber, SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { Keypair, SystemProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { deserialize } from 'borsh'
import { base58, sha256 } from '@liquality/crypto'
import { validateValue, validateSecretHash, validateExpiration, addressToString } from '@liquality/utils'

import {
  Template,
  initSchema,
  claimSchema,
  createInitBuffer,
  createClaimBuffer,
  createRefundBuffer,
  InitData,
  refundSchema
} from './layouts'
import bytecode from './bytecode'

export default class SolanaSwapProvider extends Provider implements Partial<SwapProvider> {
  doesBlockScan: boolean | (() => boolean)
  signer: Keypair

  generateSecret(message: string): Promise<string> {
    return sha256(message)
  }

  async getSwapSecret(claimTxHash: string): Promise<string> {
    const transactionByHash = await this.getMethod('getTransactionByHash')(claimTxHash)

    const programId = transactionByHash._raw.programId.toString()

    const initTxParams = await this.initTxParams(programId)

    return initTxParams.secret_hash
  }

  async initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction> {
    const signer = await this.getMethod('getSigner')()

    const programId = await this.getMethod('sendTransaction')({ bytecode })

    const { expiration, refundAddress, recipientAddress, value, secretHash } = swapParams

    const initBuffer = createInitBuffer({
      buyer: recipientAddress.toString(),
      seller: refundAddress.toString(),
      expiration,
      secret_hash: secretHash,
      value: value.toNumber()
    })

    const appAccount = new Keypair()
    const lamports = await this.getMethod('getMinimumBalanceForRentExemption')(initBuffer.length)

    const systemAccountInstruction = this._createStorageAccountInstruction(
      signer,
      appAccount,
      value.plus(lamports),
      initBuffer.length,
      programId
    )

    const transactionInstruction = this._createTransactionInstruction(signer, appAccount, programId, initBuffer)

    return await this.getMethod('sendTransaction')({
      instructions: [systemAccountInstruction, transactionInstruction],
      accounts: [appAccount]
    })
  }

  async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const [initTransaction] = await this.getMethod('getParsedAndConfirmedTransactions')([initiationTxHash])

    const { programId, buyer } = initTransaction._raw

    const [programAccount] = await this.getMethod('getProgramAccounts')(programId.toString())

    if (!programAccount) {
      throw new Error('AccountDoesNotExist')
    }

    const appAccount = new PublicKey(programAccount.pubkey)
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

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const [initTransaction] = await this.getMethod('getParsedAndConfirmedTransactions')([initiationTxHash])

    const { programId, seller } = initTransaction._raw

    const [programAccount] = await this.getMethod('getProgramAccounts')(programId.toString())

    if (!programAccount) {
      throw new Error('AccountDoesNotExist')
    }

    const appAccount = new PublicKey(programAccount.pubkey)
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

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    this._validateSwapParams(swapParams)

    const [initTransaction] = await this.getMethod('getParsedAndConfirmedTransactions')([initiationTxHash])

    return this._compareParams(swapParams, initTransaction._raw)
  }

  async _collectLamports(
    appAccountPubkey: PublicKey,
    recipient: PublicKey,
    data: Uint8Array,
    _programId: string
  ): Promise<TransactionInstruction> {
    const signer = await this.getMethod('getSigner')()
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

  async initTxParams(programId: string): Promise<any> {
    const accounts = await this.getMethod('getProgramAccounts')(programId)

    const accountInfo = await this.getMethod('getAccountInfo')(accounts[0].pubkey.toString())

    return this._deserialize(accountInfo.data)
  }

  async fundSwap(): Promise<null> {
    return null
  }

  _validateSwapParams(swapParams: SwapParams): void {
    validateValue(swapParams.value)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
    this._validateAddress(addressToString(swapParams.recipientAddress))
    this._validateAddress(addressToString(swapParams.refundAddress))
  }

  _validateAddress(address: string): boolean {
    return typeof address === 'string' && address.length === 44
  }

  _compareParams(swapParams: SwapParams, transactionParams: InitData): boolean {
    return (
      swapParams.recipientAddress === transactionParams.buyer &&
      swapParams.refundAddress === transactionParams.seller &&
      swapParams.secretHash === transactionParams.secret_hash &&
      new BigNumber(swapParams.expiration).eq(transactionParams.expiration) &&
      swapParams.value.eq(transactionParams.value)
    )
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

    const acc = SystemProgram.createAccount({
      fromPubkey: signer.publicKey,
      newAccountPubkey,
      lamports: lamports.toNumber(),
      space,
      programId
    })

    return acc
  }

  _createTransactionInstruction = (
    signer: Keypair,
    appAccount: Keypair,
    _programId: string,
    data: Uint8Array
  ): TransactionInstruction => {
    const programId = new PublicKey(_programId)

    const trans = new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccount.publicKey, isSigner: false, isWritable: true }
      ],
      programId,
      data: Buffer.from(data)
    })

    return trans
  }

  _deserialize(data: string) {
    if (data) {
      const decoded = base58.decode(data)

      const instruction = decoded[0]

      let schemaToUse

      switch (instruction) {
        case 0: {
          schemaToUse = initSchema
          break
        }
        case 1: {
          schemaToUse = claimSchema
          break
        }
        case 2: {
          schemaToUse = refundSchema
          break
        }
        default: {
          break
        }
      }

      const deserilized = deserialize(schemaToUse, Template, decoded)

      return deserilized
    }
  }
}
