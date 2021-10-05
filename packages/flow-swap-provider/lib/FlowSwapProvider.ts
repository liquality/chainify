import { SwapProvider, SwapParams, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'

import * as fcl from '@onflow/fcl'
import types from '@onflow/types'
import { addressToString, validateExpiration, validateSecretHash, validateValue } from '@liquality/utils'
import { formatTimestamp, formatTokenUnits, parseTimestamp, parseTokenUnits } from '@liquality/flow-utils'

export default class FlowSwapProvider extends Provider implements Partial<SwapProvider> {
  constructor() {
    super()
  }

  getSwapSecret(claimTxHash: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async initiateSwap(swapParams: SwapParams): Promise<Transaction<any>> {
    console.log('SECRET HASH', swapParams.secretHash)
    this._validateSwapParams(swapParams)

    try {
      await this.getMethod('sendTransaction')({
        transaction: this._createManager()
      })
    } catch {
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const args = this._convertSwapParamsToArgs(swapParams)
      console.log(args)
      return await this.getMethod('sendTransaction')({
        transaction: this._createHTLC(),
        args
      })
    }
  }

  async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction<any>> {
    console.log('secret', secret)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const [refundAddress, recipientAddress, _, expiration, secretHash] = this._convertSwapParamsToArgs(swapParams);

    const args = [refundAddress, recipientAddress, expiration, secretHash, fcl.arg(secret, types.String)]

    return await this.getMethod('sendTransaction')({
      transaction: this._claimHTLC(),
      args
    })
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const [refundAddress, recipientAddress, _, expiration, secretHash] = this._convertSwapParamsToArgs(swapParams);

    const args = [refundAddress, recipientAddress, expiration, secretHash]

    return await this.getMethod('sendTransaction')({
      transaction: this._refundHTLC(),
      args
    })
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    this._validateSwapParams(swapParams)

    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    if(!initTx) {
      throw new Error('no tx found')
    }

    const { _raw: { args } } = initTx

    
    if(!this.doesTransactionMatchInitiation(swapParams, args)) {
      throw new Error('Txs do not match params')
    }

    return true
  }

  doesTransactionMatchInitiation(swapParams: SwapParams, txParams: any) {
    const [refundAddress, recipientAddress, value, expiration, secretHash] = txParams

    return (
      swapParams.refundAddress === refundAddress.value &&
      swapParams.recipientAddress === recipientAddress.value &&
      swapParams.secretHash === secretHash.value &&
      swapParams.expiration === parseTimestamp(expiration.value) &&
      swapParams.value.eq(parseTokenUnits(value.value).toString())
    )
  }

  _createManager() {
    return fcl.transaction`\
        import HTLCs from 0xHTLCADDRESS
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
    return fcl.transaction`\
    import HTLCs from 0xHTLCADDRESS
    import FungibleToken from 0xFUNGIBLETOKENADDRESS
    import FlowToken from 0xFLOWTOKENADDRESS
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
    return fcl.transaction`\
    import HTLCs from 0xHTLCADDRESS
    import FungibleToken from 0xFUNGIBLETOKENADDRESS
    import FlowToken from 0xFLOWTOKENADDRESS

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
    return fcl.transaction`\
    import HTLCs from 0xHTLCADDRESS
    import FungibleToken from 0xFUNGIBLETOKENADDRESS
    import FlowToken from 0xFLOWTOKENADDRESS
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

  _validateSwapParams(swapParams: SwapParams) {
    const validateAddress = (address: string) => {
      if (typeof address !== 'string' || !address.startsWith('0x') || address.length !== 18) {
        throw new Error(`Invalid Address`)
      }
    }

    validateValue(swapParams.value)
    validateExpiration(swapParams.expiration)
    validateSecretHash(swapParams.secretHash)
    validateAddress(addressToString(swapParams.recipientAddress))
    validateAddress(addressToString(swapParams.refundAddress))
  }

  _convertSwapParamsToArgs(swapParams: SwapParams) {
    const { 
      recipientAddress,
      refundAddress,
      expiration,
      secretHash,
      value 
    } = swapParams;

    return [
      fcl.arg(refundAddress, types.Address),
      fcl.arg(recipientAddress, types.Address),
      fcl.arg(formatTokenUnits(value, 8), types.UFix64),
      fcl.arg(formatTimestamp(expiration), types.UFix64),
      fcl.arg(secretHash, types.String),
    ]
  }
}
