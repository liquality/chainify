export interface EIP1559Fee {
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;

    baseFeeTrend?: number;
    currentBaseFeePerGas?: number;
    suggestedBaseFeePerGas?: number;
}

export type FeeType = EIP1559Fee | number;

export interface FeeDetail {
    // Fee price
    fee: FeeType;
    // Estimated time to confirmation
    wait?: number;
}

export interface FeeDetails {
    slow: FeeDetail;
    average: FeeDetail;
    fast: FeeDetail;
}

export interface FeeProvider {
    getFees(): Promise<FeeDetails>;
}
