import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Fee } from '@liquality/client';
import { EvmUtils } from '@liquality/evm';
import { FeeDetails } from '@liquality/types';

export class EIP1559MockFeeProvider extends Fee {
    provider: StaticJsonRpcProvider;

    constructor(provider: StaticJsonRpcProvider) {
        super();
        this.provider = provider;
    }

    async getFees(): Promise<FeeDetails> {
        const feeData = await this.provider.getFeeData();

        const fees = {
            slow: {
                fee: {
                    maxFeePerGas: feeData.maxFeePerGas.toNumber(),
                    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toNumber(),
                },
            },
            average: {
                fee: {
                    maxFeePerGas: EvmUtils.calculateFee(feeData.maxFeePerGas.toNumber(), 1.1),
                    maxPriorityFeePerGas: EvmUtils.calculateFee(feeData.maxPriorityFeePerGas.toNumber(), 1.1),
                },
            },
            fast: {
                fee: {
                    maxFeePerGas: EvmUtils.calculateFee(feeData.maxFeePerGas.toNumber(), 1.4),
                    maxPriorityFeePerGas: EvmUtils.calculateFee(feeData.maxPriorityFeePerGas.toNumber(), 1.4),
                },
            },
        };

        return fees;
    }
}
