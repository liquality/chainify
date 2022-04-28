import { Asset, BigNumber, FeeDetails, FeeProvider } from '@chainify/types';

export default abstract class Fee implements FeeProvider {
    public gasUnits: BigNumber;

    constructor(gasUnits?: BigNumber) {
        this.gasUnits = gasUnits;
    }

    abstract getFees(feeAsset?: Asset): Promise<FeeDetails>;
}
