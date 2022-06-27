import { Fee, HttpClient } from '@chainify/client';
import { UnsupportedMethodError } from '@chainify/errors';
import { FeeDetails } from '@chainify/types';
import { EvmNetworks } from '../../networks';
import { AvalancheFeeParser, AvalancheResponse } from './avalanche';
import { EthereumFeeParser, EthereumResponse } from './ethereum';
import { PolygonFeeParser, PolygonResponse } from './polygon';

export class EIP1559FeeApiProvider extends Fee {
    private _httpClient: HttpClient;
    private _chainId: number;

    constructor(url: string, chainId: number) {
        super();
        this._httpClient = new HttpClient({ baseURL: url });
        this._chainId = chainId;
    }

    public async getFees(): Promise<FeeDetails> {
        const result = await this._httpClient.nodeGet('/');
        const fee = this.parseFeeResponse(result);
        return fee;
    }

    private parseFeeResponse(response: Response): FeeDetails {
        switch (this._chainId) {
            case EvmNetworks.ethereum_mainnet.chainId: {
                return new EthereumFeeParser().parse(response as EthereumResponse);
            }

            case EvmNetworks.avax_mainnet.chainId: {
                return new AvalancheFeeParser().parse(response as AvalancheResponse);
            }

            case EvmNetworks.polygon_mainnet.chainId: {
                return new PolygonFeeParser().parse(response as PolygonResponse);
            }

            default: {
                throw new UnsupportedMethodError(`EIP1559 not supported for ${this._chainId}`);
            }
        }
    }
}

type Response = EthereumResponse | AvalancheResponse | PolygonResponse;
