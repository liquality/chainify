import { ClientTypes } from '@chainify/client';
import { BaseProvider } from '@ethersproject/providers';
import { NFTAsset, NftTypes } from '../types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmNftProvider } from './EvmNftProvider';

export class OpenSeaNftProvider extends EvmNftProvider {
    constructor(walletProvider: EvmBaseWalletProvider<BaseProvider>, httpConfig: ClientTypes.AxiosRequestConfig) {
        super(walletProvider, httpConfig);
    }

    async fetch(): Promise<NFTAsset[]> {
        const userAddress = await this.walletProvider.getAddress();
        const nfts = await this.httpClient.nodeGet(`assets?owner=${userAddress}`);

        const data = nfts.assets.map((nft: any) => {
            if (nft.asset_contract) {
                const { schema_name, address } = nft.asset_contract;

                if (schema_name && address) {
                    this.cache[address] = {
                        contract: this.schemas[schema_name].attach(address),
                        schema: schema_name as NftTypes,
                    };
                }

                const {
                    image_preview_url,
                    image_thumbnail_url,
                    image_original_url,
                    asset_contract,
                    collection,
                    token_id,
                    id,
                    external_link,
                    description,
                } = nft;

                const { image_url, name, symbol } = asset_contract;

                return {
                    asset_contract: {
                        address,
                        external_link,
                        image_url,
                        name,
                        symbol,
                    },
                    collection: {
                        name: collection.name,
                    },
                    description,
                    external_link,
                    id,
                    image_original_url,
                    image_preview_url,
                    image_thumbnail_url,
                    name,
                    token_id,
                } as NFTAsset;
            }
        });
        return data;
    }
}
