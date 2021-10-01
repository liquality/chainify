import { WalletProvider } from '@liquality/wallet-provider'
import { Address, ChainProvider, Network } from '@liquality/types'
import { FlowNetwork } from '@liquality/flow-networks'
import { mnemonicToSeed } from 'bip39'

import * as fcl from '@onflow/fcl'
// import * as types from '@onflow/types'

// import * as sdk from '@onflow/sdk'
// import { template as createAccount } from '@onflow/six-create-account'
import { encodeKey, ECDSA_secp256k1, SHA3_256 } from '@onflow/util-encode-key'

import { ec as EC } from 'elliptic'
import { SHA3 } from 'sha3'
import hdkey from 'hdkey'
// import { privateToPublic } from 'ethereumjs-util'

interface FlowJsWalletProviderOptions {
  network: FlowNetwork
  mnemonic: string
  derivationPath: string
}

export default class FlowWalletProvider extends WalletProvider implements Partial<ChainProvider> {
  _network: FlowNetwork
  private _mnemonic: string
  private _derivationPath: string
  private _addressCache: { [key: string]: Address }
  private _privateKey: string

  constructor(options: FlowJsWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath || "m/44'/" + this._network.coinType + "/769'/0'/0"
    this._addressCache = {}
    this._privateKey = null

    // TODO remove: suppressing linter errors
    console.log(this._authz)
    console.log(this._privateKey)

    fcl
      .config()
      .put('accessNode.api', this._network.rpcUrl)
      .put('env', this._network.isTestnet ? 'testnet' : 'mainnet')
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const keys = await this._geenrateKeys()
    this._privateKey = keys.private
    const publicKeyEncoded = encodeKey(keys.public, ECDSA_secp256k1, SHA3_256, 1000)

    const address = this.getMethod('accountAddress')(publicKeyEncoded)

    const result = new Address({
      address: address,
      derivationPath: this._derivationPath,
      publicKey: publicKeyEncoded
    })

    this._addressCache[this._mnemonic] = result
    return [result]
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses()
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async signMessage(message: string): Promise<string> {
    console.log(message)

    // await this.getAddresses()
    // const buffer = Buffer.from(message)
    // const signature = await Secp256k1.createSignature(buffer, this._privateKey)
    // return (
    //   Buffer.from(signature.r(32)).toString('hex') +
    //   Buffer.from(signature.s(32)).toString('hex') +
    //   signature.recovery.toString()
    // )

    return ''
  }

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    console.log(rawTransaction)
    return ''
  }

  // async getAddresses() {

  //   const authorization = await authz(
  //     '0x35f382ee21cef78d',
  //     '0',
  //     '3e47bf5f5f7851ef36cba1aed43cad42b7ed8633111dd951607ef113fd88b4c2'
  //   )

  //   try {
  //     const txId = await fcl
  //       .send([
  //         fcl.transaction(`\
  //         transaction(a: UFix64, b: Address) {
  //           prepare(acct: AuthAccount) {}
  //         }`),
  //         // fcl.transaction(`\
  //         // import FungibleToken from 0x9a0766d93b6608b7
  //         // import FlowToken from 0x7e60df042a9c0868
  //         // transaction(amount: UFix64, to: Address) {
  //         //     // The Vault resource that holds the tokens that are being transferred
  //         //     let sentVault: @FungibleToken.Vault
  //         //     prepare(signer: AuthAccount) {
  //         //         // Get a reference to the signer's stored vault
  //         //         let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
  //         //             ?? panic("Could not borrow reference to the owner's Vault!")
  //         //         // Withdraw tokens from the signer's stored vault
  //         //         self.sentVault <- vaultRef.withdraw(amount: amount)
  //         //     }
  //         //     execute {
  //         //         // Get the recipient's public account object
  //         //         let recipient = getAccount(to)
  //         //         // Get a reference to the recipient's Receiver
  //         //         let receiverRef = recipient.getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()
  //         //             ?? panic("Could not borrow receiver reference to the recipient's Vault")
  //         //         // Deposit the withdrawn tokens in the recipient's receiver
  //         //         receiverRef.deposit(from: <-self.sentVault)
  //         //     }
  //         // }`),
  //         fcl.args([fcl.arg('1.0', types.UFix64), fcl.arg('0xeb57e6ef97aba0aa', types.Address)]),
  //         fcl.proposer(authorization),
  //         fcl.payer(authorization),
  //         fcl.authorizations([authorization]),
  //         fcl.limit(100)
  //       ])
  //       .then(fcl.decode)

  //     console.log('restxIdult:', txId)
  //   } catch (e) {
  //     console.log(e)
  //   }
  //   return
  // }

  // ===== FLOW SPECIFIC FEATURES =====
  private _authz(flowAccountAddress: string, flowAccountKeyId: string, flowAccountPrivateKey: string) {
    return (account: any) => {
      return {
        ...account,
        tempId: [flowAccountAddress, flowAccountKeyId].join('-'),
        addr: fcl.sansPrefix(flowAccountAddress),
        keyId: Number(flowAccountKeyId),
        signingFunction: (signable: { message: string }) => ({
          addr: fcl.withPrefix(flowAccountAddress),
          keyId: Number(flowAccountKeyId),
          signature: this._sign(flowAccountPrivateKey, signable.message)
        })
      }
    }
  }

  // ===== HELPER METHODS =====
  private _hashMessage(message: string) {
    const sha = new SHA3(256)
    sha.update(Buffer.from(message, 'hex'))
    return sha.digest()
  }

  private _sign(privateKey: string, msgHex: string) {
    const ec = new EC('p256')
    const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
    const sig = key.sign(this._hashMessage(msgHex))
    const n = 32
    const r = sig.r.toArrayLike(Buffer, 'be', n)
    const s = sig.s.toArrayLike(Buffer, 'be', n)
    return Buffer.concat([r, s]).toString('hex')
  }

  private async _geenrateKeys() {
    const seed = await mnemonicToSeed(this._mnemonic)
    const node = await hdkey.fromMasterSeed(seed)
    // public key is compressed
    const hdKey = node.derive(this._derivationPath)

    // generating a non compressed public key
    const ec = new EC('secp256k1')
    const keyPair = ec.keyFromPrivate(hdKey._privateKey.toString('hex'))
    const privKey = keyPair.getPrivate('hex')
    const pubKey = keyPair.getPublic().encode('hex')

    return { private: privKey, public: pubKey }
  }
}
