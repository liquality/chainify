import { BigNumber, FeeDetails, FeeProvider } from '@liquality/types';

export default abstract class Fee implements FeeProvider {
    public gasUnits: BigNumber;

    constructor(gasUnits?: BigNumber) {
        this.gasUnits = gasUnits;
    }

    abstract getFees(): Promise<FeeDetails>;
}
