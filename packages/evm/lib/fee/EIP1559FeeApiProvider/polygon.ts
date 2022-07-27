import { NodeError } from '@chainify/errors';
import { FeeDetails } from '@chainify/types';
import { Math } from '@chainify/utils';

export class PolygonFeeParser {
    public parse(response: PolygonResponse): FeeDetails {
        if (response.status === '1' && response.message === 'OK') {
            const suggestedBaseFeePerGas = Number(response.result.suggestBaseFee);

            return {
                slow: {
                    fee: {
                        maxFeePerGas: Number(response.result.SafeGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.SafeGasPrice, suggestedBaseFeePerGas).toNumber(),
                        suggestedBaseFeePerGas,
                    },
                },
                average: {
                    fee: {
                        maxFeePerGas: Number(response.result.ProposeGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.ProposeGasPrice, suggestedBaseFeePerGas).toNumber(),
                        suggestedBaseFeePerGas,
                    },
                },
                fast: {
                    fee: {
                        maxFeePerGas: Number(response.result.FastGasPrice),
                        maxPriorityFeePerGas: Math.sub(response.result.FastGasPrice, suggestedBaseFeePerGas).toNumber(),
                        suggestedBaseFeePerGas,
                    },
                },
            };
        } else {
            throw new NodeError('Could not fetch Polygon fee data', response);
        }
    }
}

interface Result {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
    UsdPrice: string;
}

export interface PolygonResponse {
    status: string;
    message: string;
    result: Result;
}
