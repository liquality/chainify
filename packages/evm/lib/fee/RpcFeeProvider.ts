import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Fee } from '@liquality/client';
import { FeeDetails } from '@liquality/types';
import { FeeOptions } from 'lib/types';
import { calculateFee } from 'lib/utils';

export class RpcFeeProvider extends Fee {
    private provider: StaticJsonRpcProvider;
    private feeOptions: FeeOptions;

    constructor(provider: StaticJsonRpcProvider | string, feeOptions: FeeOptions) {
        super();

        if (typeof provider === 'string') {
            this.provider = new StaticJsonRpcProvider(provider);
        } else {
            this.provider = provider;
        }

        this.feeOptions = feeOptions;
    }

    async getFees(): Promise<FeeDetails> {
        const baseGasPrice = (await this.provider.getFeeData()).gasPrice?.toNumber();
        return {
            slow: { fee: calculateFee(baseGasPrice, this.feeOptions.slowMultiplier || 1) },
            average: { fee: calculateFee(baseGasPrice, this.feeOptions.averageMultiplier || 1.5) },
            fast: { fee: calculateFee(baseGasPrice, this.feeOptions.fastMultiplier || 2) },
        };
    }
}
