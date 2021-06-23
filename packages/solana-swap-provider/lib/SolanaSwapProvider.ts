import { BigNumber, SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { Keypair, SystemProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { deserialize } from 'borsh'
import { sha256 } from '@liquality/crypto'
import { validateValue, validateSecretHash, validateExpiration } from '@liquality/utils'

import { Template, initSchema, createInitBuffer, createClaimBuffer, createRefundBuffer, InitData } from './layouts'

export default class SolanaSwapProvider extends Provider implements Partial<SwapProvider> {
  doesBlockScan: boolean | (() => boolean)
  signer: Keypair

  generateSecret(message: string): Promise<string> {
    return sha256(message)
  }

  async getSwapSecret(claimTxHash: string): Promise<string> {
    const transactionByHash = await this.getMethod('getTransactionByHash')(claimTxHash)

    const programId = transactionByHash._raw.programId.toString()

    const data = await this._readAccountData(programId)

    return data.secret_hash
  }

  async initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
    // const programId = '5QG3YbJNXPyzR2Nv19hQN7xb28TwgLN41Wp6CFaRQa5W'

    const signer = this.getMethod('getSigner')()

    const programId = await this.getMethod('_deploy')(signer)

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

  async claimSwap(
    swapParams: SwapParams,
    initiationTxHash: string,
    secret: string,
    fee: number
  ): Promise<Transaction<any>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const transactionByHash = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const programId = transactionByHash._raw.programId.toString()

    const [[firstAccount], data] = await Promise.all([
      this.getMethod('getProgramAccounts')(programId),
      this._readAccountData(programId)
    ])

    const appAccount = new PublicKey(firstAccount.pubkey)
    const buyerAccount = new PublicKey(data.buyer)

    const transactionInstruction = this._collectLamports(appAccount, buyerAccount, createClaimBuffer(secret), programId)

    return await this.getMethod('sendTransaction')({
      instructions: [transactionInstruction]
    })
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const transactionByHash = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const programId = transactionByHash._raw.programId.toString()

    const [[firstAccount], { seller }] = await Promise.all([
      this.getMethod('getProgramAccounts')(programId),
      this._readAccountData(programId)
    ])

    const appAccount = new PublicKey(firstAccount.pubkey)
    const sellerAccount = new PublicKey(seller)

    const transactionInstruction = this._collectLamports(appAccount, sellerAccount, createRefundBuffer(), programId)

    return await this.getMethod('sendTransaction')({
      instructions: [transactionInstruction]
    })
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    this._validateSwapParams(swapParams)

    const transactionByHash = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const data = await this._readAccountData(transactionByHash._raw.programId.toString())

    return this._compareParams(swapParams, data)
  }

  _collectLamports(appAccount: any, recipient: PublicKey, data: any, _programId: string): TransactionInstruction {
    const appAccountPubkey = appAccount.publicKey || appAccount
    const signer = this.getMethod('getSigner')()
    const programId = new PublicKey(_programId)

    return new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccountPubkey, isSigner: false, isWritable: true },
        { pubkey: recipient, isSigner: false, isWritable: true }
      ],
      programId,
      data
    })
  }

  async _readAccountData(programId: string) {
    const accounts = await this.getMethod('getProgramAccounts')(programId)

    const accountInfo = await this.getMethod('getAccountInfo')(accounts[0].pubkey)

    return deserialize(initSchema, Template, accountInfo.data)
  }

  _validateSwapParams(swapParams: SwapParams): void {
    validateValue(swapParams.value)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
    this._validateAddress(swapParams.recipientAddress as string)
    this._validateAddress(swapParams.refundAddress as string)
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
    data: any
  ): TransactionInstruction => {
    const programId = new PublicKey(_programId)

    return new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccount.publicKey, isSigner: false, isWritable: true }
      ],
      programId,
      data
    })
  }
}
