export interface FeeDetail {
  // Fee price
  fee: number
  // Estimated time to confirmation
  wait: number
}

export interface FeeDetails {
  slow: FeeDetail
  average: FeeDetail
  fast: FeeDetail
}
