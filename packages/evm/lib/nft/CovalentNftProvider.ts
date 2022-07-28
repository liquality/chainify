import { HttpClient } from '@chainify/client';
import { NFTAsset } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import { NftProviderConfig, NftTypes } from '../types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmNftProvider } from './EvmNftProvider';

export class CovalentNftProvider extends EvmNftProvider {
    private readonly _config: NftProviderConfig;
    private readonly _httpClient: HttpClient;

    constructor(walletProvider: EvmBaseWalletProvider<BaseProvider>, config: NftProviderConfig) {
        super(walletProvider);
        this._config = config;
        this._httpClient = new HttpClient({
            baseURL: config.url,
            responseType: 'text',
            transformResponse: undefined,
        });
    }

    async fetch(): Promise<NFTAsset[]> {
        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);
        const response = await this._httpClient.nodeGet(
            `/${network.chainId}/address/${userAddress}/balances_v2/?format=JSON&nft=true&no-nft-fetch=false&key=${this._config.apiKey}`
        );

        return response.data.items.reduce((result, asset) => {
            if (asset.type === 'nft') {
                const { contract_name, contract_ticker_symbol, contract_address, supports_erc, nft_data } = asset;
                const schema_type = supports_erc?.pop()?.toUpperCase();

                if (schema_type in NftTypes && contract_address) {
                    let nftAsset: NFTAsset = {
                        token_id: null,
                        asset_contract: {
                            address: contract_address,
                            name: contract_name,
                            symbol: contract_ticker_symbol,
                        },
                        collection: {
                            name: contract_name,
                        },
                    };

                    this.cache[contract_address] = {
                        contract: this.schemas[schema_type].attach(contract_address),
                        schema: schema_type,
                    };

                    if (nft_data.length) {
                        nft_data.forEach((data) => {
                            const { external_data } = data;

                            nftAsset = {
                                ...nftAsset,
                                token_id: data?.token_id,
                                name: external_data?.name,
                                description: external_data?.description,
                                external_link: external_data?.external_url,
                                image_original_url: external_data?.image,
                                image_preview_url: external_data?.image,
                                image_thumbnail_url: external_data?.image,
                            };

                            result.push(nftAsset);
                        });
                    }
                }
            }
            return result;
        }, []);
    }
}
