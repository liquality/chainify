import { Asset, BigNumber, FeeDetails, FeeProvider, MultiLayerFeeDetails, MultiLayerFeeProvider } from '@chainify/types';

export default abstract class Fee implements FeeProvider, MultiLayerFeeProvider {
    public gasUnits: BigNumber;

    constructor(gasUnits?: BigNumber) {
        this.gasUnits = gasUnits;
    }

    abstract getFees(feeAsset?: Asset): Promise<FeeDetails>;

    getMultiLayerFees(): Promise<MultiLayerFeeDetails> {
        throw new Error(`Method 'getMultiLayerFees' is not implemented`);
    }
}
