import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Fee } from '@liquality/client';
import { FeeDetails } from '@liquality/types';
import { FeeOptions } from '../types';
import { calculateFee } from '../utils';

export class RpcFeeProvider extends Fee {
    private provider: StaticJsonRpcProvider;
    private feeOptions: FeeOptions;

    constructor(provider: StaticJsonRpcProvider | string, feeOptions?: FeeOptions) {
        super();

        if (typeof provider === 'string') {
            this.provider = new StaticJsonRpcProvider(provider);
        } else {
            this.provider = provider;
        }

        this.feeOptions = {
            slowMultiplier: feeOptions?.slowMultiplier || 1,
            averageMultiplier: feeOptions?.averageMultiplier || 1.5,
            fastMultiplier: feeOptions?.fastMultiplier || 2,
        };
    }

    async getFees(): Promise<FeeDetails> {
        const feeData = await this.provider.getFeeData();
        const baseGasPrice = feeData.gasPrice?.div(1e9).toNumber();
        return {
            slow: { fee: calculateFee(baseGasPrice, this.feeOptions.slowMultiplier) },
            average: { fee: calculateFee(baseGasPrice, this.feeOptions.averageMultiplier) },
            fast: { fee: calculateFee(baseGasPrice, this.feeOptions.fastMultiplier) },
        };
    }
}
