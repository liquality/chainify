import { NodeError } from '@chainify/errors';
import { FeeDetails } from '@chainify/types';
import { Math } from '@chainify/utils';

export class AvalancheFeeParser {
    public parse(response: AvalancheResponse): FeeDetails {
        if (response.status === '1' && response.message === 'OK') {
            return {
                slow: {
                    fee: {
                        maxFeePerGas: Number(response.result.SafeGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.SafeGasPrice, 1).toNumber(),
                        suggestedBaseFeePerGas: 1,
                    },
                },
                average: {
                    fee: {
                        maxFeePerGas: Number(response.result.ProposeGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.ProposeGasPrice, 1.5).toNumber(),
                        suggestedBaseFeePerGas: 1.5,
                    },
                },
                fast: {
                    fee: {
                        maxFeePerGas: Number(response.result.FastGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.FastGasPrice, 2).toNumber(),
                        suggestedBaseFeePerGas: 2,
                    },
                },
            };
        } else {
            throw new NodeError('Could not fetch Avalanche fee data', { ...response });
        }
    }
}

interface Result {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    UsdPrice: string;
}

export interface AvalancheResponse {
    status: string;
    message: string;
    result: Result;
}
