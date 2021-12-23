export interface FeeHistory {
  baseFeePerGas: string[]
  gasUsedRatio: number[]
  reward?: string[][]
  oldestBlock: string
}

export interface EIP1559Fee {
  // Base fee per gas
  baseFeePerGas?: number
  // Fee price
  maxPriorityFeePerGas: number
  // Estimated time to confirmation
  maxFeePerGas: number
}

export interface FeeDetail {
  // Fee price
  fee: EIP1559Fee | number
  // Estimated time to confirmation
  wait?: number
}

export interface FeeDetails {
  slow: FeeDetail
  average: FeeDetail
  fast: FeeDetail
}

export interface FeeProvider {
  /**
   * @return {Promise<FeeDetails>} Resolves with an
   *  identifier for the broadcasted transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getFees(): Promise<FeeDetails>
}
