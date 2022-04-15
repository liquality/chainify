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
                    maxFeePerGas: EvmUtils.toGwei(feeData.maxFeePerGas.toNumber()).toNumber(),
                    maxPriorityFeePerGas: EvmUtils.toGwei(feeData.maxPriorityFeePerGas.toNumber()).toNumber(),
                },
            },
            average: {
                fee: {
                    maxFeePerGas: EvmUtils.toGwei(EvmUtils.calculateFee(feeData.maxFeePerGas.toNumber(), 1.1)).toNumber(),
                    maxPriorityFeePerGas: EvmUtils.toGwei(EvmUtils.calculateFee(feeData.maxPriorityFeePerGas.toNumber(), 1.1)).toNumber(),
                },
            },
            fast: {
                fee: {
                    maxFeePerGas: EvmUtils.toGwei(EvmUtils.calculateFee(feeData.maxFeePerGas.toNumber(), 1.4)).toNumber(),
                    maxPriorityFeePerGas: EvmUtils.toGwei(EvmUtils.calculateFee(feeData.maxPriorityFeePerGas.toNumber(), 1.4)).toNumber(),
                },
            },
        };

        return fees;
    }
}
