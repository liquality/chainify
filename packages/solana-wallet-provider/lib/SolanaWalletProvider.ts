import { WalletProvider } from '@liquality/wallet-provider'
import { Address, Network, solana } from '@liquality/types'
import { SolanaNetwork } from '@liquality/solana-network'

import { validateMnemonic, mnemonicToSeed } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import {
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  sendAndConfirmTransaction
} from '@solana/web3.js'
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

  constructor(options: SolanaWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
  }

  async isWalletAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const seed = await this._mnemonicToSeed(this._mnemonic)
    const derivedSeed = derivePath(this._derivationPath, seed).key

    const account = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)

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

  // Promise<Transaction<any>>
  async sendTransaction(options: solana.SolanaSendOptions): Promise<any> {
    const signer = options.signer
    const transaction = new Transaction()

    if (!options.instructions) {
      const to = new PublicKey(options.to)
      const lamports = Number(options.value)

      transaction.add(this._sendBetweenAccounts(signer, to, lamports))
    } else {
      options.instructions.forEach((instruction) => transaction.add(instruction))
    }

    const tx = await this.getMethod('sendAndConfirmTransaction')(transaction, [options.signer])

    console.log(tx)

    return tx
  }

  // message: string, from: string
  signMessage(): Promise<string> {
    throw new Error('Method not implemented.')
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

  _sendBetweenAccounts(signer: Keypair, recepient: PublicKey, lamports: number): TransactionInstruction {
    return SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: recepient,
      lamports
    })
  }
}
