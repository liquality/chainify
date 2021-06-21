import { BigNumber, SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'

import { Keypair, SystemProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { deserialize } from 'borsh'

import { Template, initSchema, createInitBuffer, createClaimBuffer, createRefundBuffer } from './layouts'

export default class SolanaSwapProvider extends Provider implements Partial<SwapProvider> {
  doesBlockScan: boolean | (() => boolean)
  signer: Keypair
  programId: string = '5cEUx2SJbvDokfHSjXjU4roD97UtXEwKbBLbNyXREsjM'

  generateSecret(message: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getSwapSecret(claimTxHash: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
    const appAccount = new Keypair()
    const signer = this.getMethod('getSigner')()

    // I have to hit deploy here and that will provide me with the program address ;-)
    const _programId = 'dsadsada'

    const { recipientAddress, refundAddress, expiration, secretHash, value } = swapParams
    const initBuffer = createInitBuffer(recipientAddress as string, refundAddress as string, secretHash, expiration)

    const lamportsForSpace = await this.getMethod('getMinimumBalanceForRentExemption')(initBuffer.length)

    this._createStorageAccountInstruction(signer, appAccount, value, lamportsForSpace, _programId)

    const transactionInstruction = this._createTransactionInstruction(signer, appAccount, _programId, initBuffer)

    console.log(transactionInstruction)

    // Here i need to call sendTransaction and provide data

    throw new Error('Method not implemented.')
  }

  // Pass
  fundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async claimSwap(
    swapParams: SwapParams,
    initiationTxHash: string,
    secret: string,
    fee: number
  ): Promise<Transaction<any>> {
    const [[firstAccount], { buyer }] = await Promise.all([
      this.getMethod('getProgramAccounts')(this.programId),
      this._readAccountData()
    ])

    const appAccount = new PublicKey(firstAccount.pubkey)
    const buyerAccount = new PublicKey(buyer)

    const transactionInstruction = this._collectLamports(appAccount, buyerAccount, createClaimBuffer(secret))

    console.log(transactionInstruction)

    // Here i need to call sendTransaction and provide data

    throw new Error('Method not implemented.')
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    const [[firstAccount], { seller }] = await Promise.all([
      this.getMethod('getProgramAccounts')(this.programId),
      this._readAccountData()
    ])

    const appAccount = new PublicKey(firstAccount.pubkey)
    const sellerAccount = new PublicKey(seller)

    const transactionInstruction = this._collectLamports(appAccount, sellerAccount, createRefundBuffer())

    console.log(transactionInstruction)

    throw new Error('Method not implemented.')
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

    return new TransactionInstruction({
      keys: [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: appAccount.publicKey, isSigner: false, isWritable: true }
      ],
      programId,
      data: Buffer.from(data)
    })
  }

  _collectLamports(appAccount: any, recipient: PublicKey, data: Uint8Array): TransactionInstruction {
    const appAccountPubkey = appAccount.publicKey || appAccount
    const signer = this.getMethod('getSigner')()
    const programId = new PublicKey(this.programId)

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

  async _readAccountData() {
    const [firstAccount] = await this.getMethod('getProgramAccounts')(this.programId)

    const accountInfo = await this.getMethod('getAccountInfo')(firstAccount.pubkey)

    return deserialize(initSchema, Template, accountInfo.data)
  }
}
