export default class Collateral {
  constructor (client) {
    this.client = client
  }

  async createRefundableCollateralScript(borrowerPubKey, lenderPubKey, secretHashA2, secretHashB1, secretHashB2, loanExpiration, biddingExpiration) {
    return this.client.getMethod('createRefundableCollateralScript')(borrowerPubKey, lenderPubKey, secretHashA2, secretHashB1, secretHashB2, loanExpiration, biddingExpiration)
  }

  async createSeizableCollateralScript (borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB1, secretHashB2, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('createSeizableCollateralScript')(borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB1, secretHashB2, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async lockCollateral (refundableValue, seizableValue, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('lockCollateral')(refundableValue, seizableValue, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async refundCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('refundCollateral')(refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async seizeCollateral (seizableTxHash, borrowerPubKey, lenderPubKey, secretA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('seizeCollateral')(seizableTxHash, borrowerPubKey, lenderPubKey, secretA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async refundRefundableCollateral (refundableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('refundRefundableCollateral')(refundableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async refundSeizableCollateral (seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration) {
    return this.client.getMethod('refundSeizableCollateral')(seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async multisigSignCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration, isBorrower, to) {
    return this.client.getMethod('multisigSignCollateral')(refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretHashA2, secretHashB2, secretHashB3, loanExpiration, biddingExpiration, seizureExpiration, isBorrower, to)
  }

  async multisigSendCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretA2, secretHashB2, secretB3, loanExpiration, biddingExpiration, seizureExpiration, borrowerSignatures, lenderSignatures, to) {
    return this.client.getMethod('multisigSendCollateral')(refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, secretHashA1, secretA2, secretHashB2, secretB3, loanExpiration, biddingExpiration, seizureExpiration, borrowerSignatures, lenderSignatures, to)
  }
}
