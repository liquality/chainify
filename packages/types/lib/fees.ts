export interface FeeDetail {
  // Fee price
  fee: number
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
  getFees () : Promise<FeeDetails>
}
