import { BigNumber, FeeDetails, Network } from '@chainify/types';
import { L2Provider } from '@eth-optimism/sdk';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { FeeOptions } from '../types';
import { calculateFee } from '../utils';
import { EvmChainProvider } from './EvmChainProvider';

export class OptimismChainProvider extends EvmChainProvider {
    private feeOptions: FeeOptions;
    protected provider: L2Provider<StaticJsonRpcProvider>;

    constructor(network: Network, provider: L2Provider<StaticJsonRpcProvider>, feeOptions?: FeeOptions, multicall = true) {
        super(network, provider, null, multicall);

        this.feeOptions = {
            slowMultiplier: feeOptions?.slowMultiplier || 1,
            averageMultiplier: feeOptions?.averageMultiplier || 1.5,
            fastMultiplier: feeOptions?.fastMultiplier || 2,
        };
    }

    public async getFees(): Promise<FeeDetails> {
        const l2FeeData = await this.provider.getFeeData();
        const l2BaseGasPrice = new BigNumber(l2FeeData.gasPrice?.toString()).div(1e9).toNumber();
        const l2Fee = this.calculateFee(l2BaseGasPrice);

        const l1FeeData = await this.provider.getL1GasPrice();
        const l1BaseGasPrice = new BigNumber(l1FeeData.toString()).div(1e9).toNumber();
        const l1Fee = this.calculateFee(l1BaseGasPrice);

        return {
            slow: { fee: l2Fee.slow, multilayerFee: { l1: l1Fee.slow, l2: l2Fee.slow } },
            average: { fee: l2Fee.average, multilayerFee: { l1: l1Fee.average, l2: l2Fee.average } },
            fast: { fee: l2Fee.fast, multilayerFee: { l1: l1Fee.fast, l2: l2Fee.fast } },
        };
    }

    private calculateFee(fee: number) {
        return {
            slow: calculateFee(fee, this.feeOptions.slowMultiplier),
            average: calculateFee(fee, this.feeOptions.averageMultiplier),
            fast: calculateFee(fee, this.feeOptions.fastMultiplier),
        };
    }
}
