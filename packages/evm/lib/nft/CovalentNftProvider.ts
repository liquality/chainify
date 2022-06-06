import { ClientTypes } from '@chainify/client';
import { BaseProvider } from '@ethersproject/providers';
import { NFTAsset } from 'lib/types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmNftProvider } from './EvmNftProvider';

export class CovalentNftProvider extends EvmNftProvider {
    private readonly _apiKey: string;

    constructor(walletProvider: EvmBaseWalletProvider<BaseProvider>, httpConfig: ClientTypes.AxiosRequestConfig, apiKey: string) {
        super(walletProvider, httpConfig);
        this._apiKey = apiKey;
    }

    async fetch(): Promise<NFTAsset[]> {
        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);
        const response = await this.httpClient.nodeGet(
            `/v1/${network.chainId}/address/${userAddress}/balances_v2/?format=JSON&nft=true&no-nft-fetch=false&key=${this._apiKey}`
        );

        return response.data.items
            .map((asset) => {
                if (asset.type === 'nft') {
                    const { contract_name, contract_ticker_symbol, contract_address, supports_erc, nft_data } = asset;

                    const resp = {
                        asset_contract: {
                            address: contract_address,
                            name: contract_name,
                            symbol: contract_ticker_symbol,
                        },
                        collection: {
                            name: contract_name,
                        },
                    };

                    if (!nft_data.length) {
                        return resp as NFTAsset;
                    }

                    const data = nft_data[0];
                    const { external_data } = data;

                    return {
                        ...resp,
                        token_id: data.token_id,
                        name: external_data.name,
                        description: external_data.description,
                        external_link: external_data.external_url,
                        image_original_url: external_data.image,
                        image_preview_url: external_data.image,
                        image_thumbnail_url: external_data.image,
                    } as NFTAsset;
                }
            })
            .filter(Boolean);
    }
}
