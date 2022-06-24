import { Fee, HttpClient } from '@chainify/client';
import { FeeDetails } from '@chainify/types';

export class EIP1559FeeApiProvider extends Fee {
    private httpClient: HttpClient;

    constructor(chainId: string | number, url?: string) {
        super();

        if (url) {
            this.httpClient = new HttpClient({ baseURL: url });
        } else {
            this.httpClient = new HttpClient({
                baseURL: `https://gas-api.metaswap.codefi.network/networks/${Number(chainId)}/suggestedGasFees`,
            });
        }
    }

    async getFees(): Promise<FeeDetails> {
        const result = await this.httpClient.nodeGet<any, ApiResponse>('/');
        const suggestedBaseFeePerGas = Number(result.estimatedBaseFee);

        const fees = {
            slow: {
                fee: {
                    maxFeePerGas: Number(result.low.suggestedMaxFeePerGas),
                    maxPriorityFeePerGas: Number(result.low.suggestedMaxPriorityFeePerGas),
                    suggestedBaseFeePerGas,
                },
            },
            average: {
                fee: {
                    maxFeePerGas: Number(result.medium.suggestedMaxFeePerGas),
                    maxPriorityFeePerGas: Number(result.medium.suggestedMaxPriorityFeePerGas),
                    suggestedBaseFeePerGas,
                },
            },
            fast: {
                fee: {
                    maxFeePerGas: Number(result.high.suggestedMaxFeePerGas),
                    maxPriorityFeePerGas: Number(result.high.suggestedMaxPriorityFeePerGas),
                    suggestedBaseFeePerGas,
                },
            },
        };

        return fees;
    }
}

type FeeDetail = {
    suggestedMaxPriorityFeePerGas: string;
    suggestedMaxFeePerGas: string;
    minWaitTimeEstimate: number;
    maxWaitTimeEstimate: number;
};
type ApiResponse = {
    low: FeeDetail;
    medium: FeeDetail;
    high: FeeDetail;
    baseFeeTrend: string;
    estimatedBaseFee: string;
};
