export default class LoanFund {
  constructor (client) {
    this.client = client
  }

  createLoanFundScript (secretHashes, maxLoanAmount, minLoanDuration, maxLoanDuration, interestRate, liquidationFeeRate, aCoinPubKey, minCollateralizationRatio, automated, lenderAuto, autoSecretHashes) {
    return this.client.getMethod('createLoanFundScript')(secretHashes, maxLoanAmount, minLoanDuration, maxLoanDuration, interestRate, liquidationFeeRate, aCoinPubKey, minCollateralizationRatio, automated, lenderAuto, autoSecretHashes)
  }

  async initiateLoanFund (secretHashes, maxLoanAmount, minLoanDuration, maxLoanDuration, interestRate, liquidationFeeRate, aCoinPubKey, minCollateralizationRatio, automated, lenderAuto, autoSecretHashes) {
    return this.client.getMethod('initiateLoanFund')(secretHashes, maxLoanAmount, minLoanDuration, maxLoanDuration, interestRate, liquidationFeeRate, aCoinPubKey, minCollateralizationRatio, automated, lenderAuto, autoSecretHashes)
  }

  async requestLoan (initiationTxHash, amount, secretHashes, loanDuration, aCoinPubKey) {
    return this.client.getMethod('requestLoan')(initiationTxHash, amount, secretHashes, loanDuration, aCoinPubKey)
  }

  async addSecretHashesLoanFund (initiationTxHash, secretHashes) {
    return this.client.getMethod('addSecretHashesLoanFund')(initiationTxHash, secretHashes)
  }

  async withdrawLoanFund (initiationTxHash, amount) {
    return this.client.getMethod('withdrawLoanFund')(initiationTxHash, amount)
  }

  async getLenderPubKey (contractAddress) {
    return this.client.getMethod('getLenderPubKey')(contractAddress)
  }

  async getLoanFundCounter (contractAddress) {
    return this.client.getMethod('getLoanFundCounter')(contractAddress)
  }

  async getLoanFundMaxLoanAmount (contractAddress) {
    return this.client.getMethod('getLoanFundMaxLoanAmount')(contractAddress)
  }

  async getLoanFundInterestRate (contractAddress) {
    return this.client.getMethod('getLoanFundInterestRate')(contractAddress)
  }

  async getLoanFundLiquidationFeeRate (contractAddress) {
    return this.client.getMethod('getLoanFundLiquidationFeeRate')(contractAddress)
  }

  async getLoanFundMinLoanDuration (contractAddress) {
    return this.client.getMethod('getLoanFundMinLoanDuration')(contractAddress)
  }

  async getLoanFundMaxLoanDuration (contractAddress) {
    return this.client.getMethod('getLoanFundMaxLoanDuration')(contractAddress)
  }
}
