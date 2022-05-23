import { BigNumber, MultiLayerFeeDetails } from '@chainify/types';
import { OptimismJsonRpcProvider } from '../rpc/OptimismJsonRpcProvider';
import { FeeOptions } from '../types';
import { calculateFee } from '../utils';
import { RpcFeeProvider } from './RpcFeeProvider';

export class OptimismFeeProvider extends RpcFeeProvider {
    // implements MultiLayerFeeProvider {
    constructor(provider: OptimismJsonRpcProvider, feeOptions?: FeeOptions) {
        super(provider, feeOptions);
    }

    async getMultiLayerFees(): Promise<MultiLayerFeeDetails> {
        const l2GasPrice = await super.getFees();

        const gasPrice = await (this.provider as OptimismJsonRpcProvider).getL1GasPrice();
        const baseGasPrice = new BigNumber(gasPrice.toString()).div(1e9).toNumber();
        const l1GasPrice = {
            slow: { fee: calculateFee(baseGasPrice, this.feeOptions.slowMultiplier) },
            average: { fee: calculateFee(baseGasPrice, this.feeOptions.averageMultiplier) },
            fast: { fee: calculateFee(baseGasPrice, this.feeOptions.fastMultiplier) },
        };

        return {
            L1: l1GasPrice,
            L2: l2GasPrice,
        };
    }
}
