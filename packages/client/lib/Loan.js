import { sha256, padHexStart } from '@liquality/crypto'
import BigNumber from 'bignumber.js'

export default class Loan {
  constructor (client) {
    this.client = client
  }

  /**
   * Generates multiple secrets.
   * @param {!string} message - Message to be used for generating secret.
   * @param {!string} address - can pass address for async claim and refunds to get deterministic secret
   * @return {Promise<string>} Resolves with a 32 byte secret
   */
  async generateSecrets (message, num = 1) {
    const address = (await this.client.getMethod('getAddresses')())[0].address
    const signedMessage = padHexStart(await this.client.getMethod('signMessage')(message, address))
    let secrets = []

    for (let i = 0; i < num; i++) {
      secrets.push(sha256(padHexStart(BigNumber(signedMessage, 16).plus(i).toString(16))))
    }

    return secrets
  }

  approveLoan (contractAddress) {
    return this.client.getMethod('approveLoan')(contractAddress)
  }

  withdrawLoan (contractAddress, secretA1) {
    return this.client.getMethod('withdrawLoan')(contractAddress, secretA1)
  }

  acceptOrCancelLoan (contractAddress, secretB1) {
    return this.client.getMethod('acceptOrCancelLoan')(contractAddress, secretB1)
  }

  paybackLoan (contractAddress) {
    return this.client.getMethod('paybackLoan')(contractAddress)
  }

  refundPaybackLoan (contractAddress) {
    return this.client.getMethod('refundPaybackLoan')(contractAddress)
  }

  startBiddingLoan (contractAddress) {
    return this.client.getMethod('startBiddingLoan')(contractAddress)
  }

  bidLoan (contractAddress, secretHashC, bidValue, aCoinAddress) {
    return this.client.getMethod('bidLoan')(contractAddress, secretHashC, bidValue, aCoinAddress)
  }

  provideSignatureLoan (contractAddress, signature) {
    return this.client.getMethod('provideSignatureLoan')(contractAddress, signature)
  }

  provideSecretLoan (contractAddress, secret) {
    return this.client.getMethod('provideSecretLoan')(contractAddress, secret)
  }

  withdrawLiquidatedCollateralLoan (contractAddress, secretA2, secretB2, secretC) {
    return this.client.getMethod('withdrawLiquidatedCollateralLoan')(contractAddress, secretA2, secretB2, secretC)
  }

  refundBidLoan (contractAddress) {
    return this.client.getMethod('refundBidLoan')(contractAddress)
  }

  async getFundedLoan (contractAddress, block) {
    return this.client.getMethod('getFundedLoan')(contractAddress, block)
  }

  async getApprovedLoan (contractAddress, block) {
    return this.client.getMethod('getApprovedLoan')(contractAddress, block)
  }

  async getWithdrawnLoan (contractAddress, block) {
    return this.client.getMethod('getWithdrawnLoan')(contractAddress, block)
  }

  async getBiddingLoan (contractAddress, block) {
    return this.client.getMethod('getBiddingLoan')(contractAddress, block)
  }

  async getRepaidLoan (contractAddress, block) {
    return this.client.getMethod('getRepaidLoan')(contractAddress, block)
  }

  async getPrincipalAmount (contractAddress, block) {
    return this.client.getMethod('getPrincipalAmount')(contractAddress, block)
  }

  async getInterestAmount (contractAddress, block) {
    return this.client.getMethod('getInterestAmount')(contractAddress, block)
  }

  async getLiquidationFeeAmount (contractAddress, block) {
    return this.client.getMethod('getLiquidationFeeAmount')(contractAddress, block)
  }

  async getSignatureLoan (contractAddress, type, block) {
    return this.client.getMethod('getSignatureLoan')(contractAddress, type, block)
  }

  async getBorrowerPubKey (contractAddress, block) {
    return this.client.getMethod('getBorrowerPubKey')(contractAddress, block)
  }

  async getApproveExpiration (contractAddress, block) {
    return this.client.getMethod('getApproveExpiration')(contractAddress, block)
  }

  async getLoanExpiration (contractAddress, block) {
    return this.client.getMethod('getLoanExpiration')(contractAddress, block)
  }

  async getAcceptExpiration (contractAddress, block) {
    return this.client.getMethod('getAcceptExpiration')(contractAddress, block)
  }

  async getBiddingExpiration (contractAddress, block) {
    return this.client.getMethod('getBiddingExpiration')(contractAddress, block)
  }

  async getSecretHashA1 (contractAddress, block) {
    return this.client.getMethod('getSecretHashA1')(contractAddress, block)
  }

  async getSecretHashA2 (contractAddress, block) {
    return this.client.getMethod('getSecretHashA2')(contractAddress, block)
  }

  async getSecretHashB1 (contractAddress, block) {
    return this.client.getMethod('getSecretHashB1')(contractAddress, block)
  }

  async getSecretHashB2 (contractAddress, block) {
    return this.client.getMethod('getSecretHashB2')(contractAddress, block)
  }
}
