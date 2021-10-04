import { SwapProvider, SwapParams, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'

import * as fcl from '@onflow/fcl'

export default class FlowSwapProvider extends Provider implements Partial<SwapProvider> {
  constructor() {
    super()
  }

  getSwapSecret(claimTxHash: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }

  verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }

  refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }

  // TODO: Move in utils
  _validateAddress(address: string) {
    if (typeof address !== 'string' || !address.startsWith('0x') || address.length !== 18) {
      throw new Error(`Invalid Address`)
    }
  }

  _createManager() {
    return fcl.transaction`
        import HTLCs from 0xdadbaee81662a80a
        transaction {
          prepare(acct: AuthAccount) {
            let htlcManager <- HTLCs.createSwapManager()
            acct.save(<-htlcManager, to: HTLCs.HtlcManagerStoragePath)
            acct.link<&HTLCs.HTLCManager{HTLCs.HTLCManagerPublic}>(HTLCs.HtlcManagerPublicPath, target: HTLCs.HtlcManagerStoragePath)
            log("manager created")
          }
        }
    `
  }

  _createHTLC() {
    return fcl.transaction`
    import HTLCs from 0xdadbaee81662a80a
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    transaction (sellerAddress: Address, buyerAddress: Address, value: UFix64, expiry: UFix64, secretHash: String) {
      prepare(acct: AuthAccount) {
        let manager = acct.borrow<&HTLCs.HTLCManager>(from: HTLCs.HtlcManagerStoragePath)!
        let buyerCapability = getAccount(buyerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let sellerCapability = getAccount(sellerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let flowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!
        var hltc = manager.createHTLC(
          secretHash: secretHash,
          expiry: expiry,
          buyer: buyerCapability,
          seller: sellerCapability,
          vault: <-flowVault.withdraw(amount: value)
        )
      }
    }
  `
  }

  _claimHTLC() {
    return fcl.transaction`
    import HTLCs from 0xdadbaee81662a80a
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    transaction(sellerAddress: Address, buyerAddress: Address, expiry: UFix64, secretHash: String, secret: String) {
      prepare(acct: AuthAccount) {
        let manager = getAccount(sellerAddress).getCapability<&HTLCs.HTLCManager{HTLCs.HTLCManagerPublic}>(HTLCs.HtlcManagerPublicPath).borrow()!
        let sellerCapability = getAccount(sellerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let buyerCapability = getAccount(buyerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        
        manager.claim(
          secret: secret,
          secretHash: secretHash,
          expiry: expiry,
          buyer: buyerCapability,
          seller: sellerCapability
        )
      }
    }
  `
  }

  _refundHTLC() {
    ;`
    import HTLCs from 0xdadbaee81662a80a
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    transaction(sellerAddress: Address, buyerAddress: Address, expiry: UFix64, secretHash: String) {
      prepare(acct: AuthAccount) {
        let manager = acct.borrow<&HTLCs.HTLCManager>(from: HTLCs.HtlcManagerStoragePath)!
        let buyerCapability = getAccount(buyerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let sellerCapability = getAccount(sellerAddress).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        
        manager.refund(
          secretHash: secretHash,
          expiry: expiry,
          buyer: buyerCapability,
          seller: sellerCapability
        )
      }
    }
  `
  }
}
