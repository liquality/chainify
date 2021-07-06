import { WalletProvider } from '@liquality/wallet-provider'
import { Address, Network, solana } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { SolanaNetwork } from '@liquality/solana-network'
import { base58 } from '@liquality/crypto'

import { validateMnemonic, mnemonicToSeed } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import { Keypair, Transaction, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js'
import nacl from 'tweetnacl'

interface SolanaWalletProviderOptions {
  network: SolanaNetwork
  mnemonic: string
  derivationPath?: string
}

export default class SolanaWalletProvider extends WalletProvider {
  _network: SolanaNetwork
  _mnemonic: string
  _derivationPath: string
  _addressCache: { [key: string]: Address }
  _signer: Keypair

  constructor(options: SolanaWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const account = await this.getSigner()

    const result = new Address({
      address: account.publicKey.toString(),
      derivationPath: this._derivationPath
    })

    this._addressCache[this._mnemonic] = result

    return [result]
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses()
  }

  async sendTransaction(options: solana.SolanaSendOptions): Promise<Transaction> {
    await this.getSigner()

    const transaction = new Transaction()

    if (!options.instructions && !options.to) {
      const programId = await this.getMethod('_deploy')(this._signer, options.bytecode)

      await this._waitForContractToBeExecutable(programId)

      return programId
    } else if (!options.instructions) {
      const to = new PublicKey(addressToString(options.to))
      const lamports = Number(options.value)

      transaction.add(await this._sendBetweenAccounts(to, lamports))
    } else {
      options.instructions.forEach((instruction) => transaction.add(instruction))
    }

    let accounts = [this._signer]

    if (options.accounts) {
      accounts = [this._signer, ...options.accounts]
    }

    const tx = await this.getMethod('sendAndConfirmTransaction')(transaction, accounts)

    const [parsedTransaction] = await this.getMethod('getTransactionReceipt')([tx])

    return parsedTransaction
  }

  async signMessage(message: string): Promise<string> {
    await this.getSigner()

    const buffer = Buffer.from(message)

    const signature = nacl.sign.detached(buffer, base58.decode(base58.encode(this._signer.secretKey)))

    return Buffer.from(signature).toString('hex')
  }

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }

  async _mnemonicToSeed(mnemonic: string) {
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid seed words')
    }

    const seed = await mnemonicToSeed(mnemonic)

    return Buffer.from(seed).toString('hex')
  }

  async getSigner(): Promise<Keypair> {
    if (!this._signer) {
      await this.setSigner()
    }

    return this._signer
  }

  async _sendBetweenAccounts(recipient: PublicKey, lamports: number): Promise<TransactionInstruction> {
    const signer = await this.getSigner()

    return SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: recipient,
      lamports
    })
  }

  async setSigner(): Promise<void> {
    const seed = await this._mnemonicToSeed(this._mnemonic)
    const derivedSeed = derivePath(this._derivationPath, seed).key

    const account = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)

    this._signer = account
  }

  canUpdateFee(): boolean {
    return false
  }

  _waitForContractToBeExecutable(programId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const accountInfo = await this.getMethod('_getAccountInfo')(programId)

        if (accountInfo.executable) {
          clearInterval(interval)
          resolve(true)
        }
      }, 5000)
    })
  }

  async sendSweepTransaction(address: string | Address): Promise<Transaction> {
    const sender = await this.getAddresses()

    const [balance, blockHash] = await Promise.all([
      this.getMethod('getBalance')([sender[0].address]),
      this.getMethod('getRecentBlockhash')()
    ])

    const _fee = blockHash.feeCalculator.lamportsPerSignature

    return await this.sendTransaction({
      to: addressToString(address),
      value: balance.minus(_fee)
    })
  }
}
