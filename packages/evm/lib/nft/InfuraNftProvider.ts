import { HttpClient } from '@chainify/client';
import { NFTAsset } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import { NftProviderConfig, NftTypes } from '../types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmNftProvider } from './EvmNftProvider';

export class InfuraNftProvider extends EvmNftProvider {
    private readonly _config: NftProviderConfig;
    private readonly _httpClient: HttpClient;

    constructor(walletProvider: EvmBaseWalletProvider<BaseProvider>, config: NftProviderConfig) {
        super(walletProvider);
        this._config = config;

        this._httpClient = new HttpClient({
            baseURL: config.url,
            transformResponse: undefined,
            headers: { Authorization: `Basic ${this._config.apiKey}` },
        });
    }

    async fetch(): Promise<NFTAsset[]> {
        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);
        const chainId = Number(network.chainId);
        const response = await this._httpClient.nodeGet(`/networks/${chainId}/accounts/${userAddress.toString()}/assets/nfts`);

        return (
            response?.assets?.reduce((result: NFTAsset[], nft: { contract: any; tokenId: any; supply: any; type: any; metadata: any }) => {
                const { contract, tokenId, supply, type, metadata } = nft;
                if (type in NftTypes && contract) {
                    this.cache[contract] = {
                        contract: this.schemas[type].attach(contract),
                        schema: type as NftTypes,
                    };
                    const _image = metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '';
                    const description =
                        metadata?.attributes?.find((i: any) => i.trait_type === 'Description')?.value || metadata?.description;
                    const nftAsset: NFTAsset = {
                        asset_contract: {
                            address: contract,
                            name: metadata?.name,
                            symbol: '',
                        },
                        collection: {
                            name: metadata?.name,
                        },
                        token_id: tokenId,
                        amount: supply,
                        standard: type,
                        name: metadata?.name,
                        description,
                        image_original_url: _image,
                        image_preview_url: _image,
                        image_thumbnail_url: _image,
                        external_link: '',
                    };

                    result.push(nftAsset);
                }

                return result;
            }, []) || []
        );
    }
}
