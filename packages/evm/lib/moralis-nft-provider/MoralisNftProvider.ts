import { ClientTypes } from '@chainify/client';
import { BaseProvider } from '@ethersproject/providers';
import { EvmNftProvider } from 'lib/nft/EvmNftProvider';
import { MoralisConfig, NFTAsset, NftTypes } from 'lib/types';
import Moralis from 'moralis/node';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';

export class MoralisNftProvider extends EvmNftProvider {
    constructor(
        walletProvider: EvmBaseWalletProvider<BaseProvider>,
        httpConfig: ClientTypes.AxiosRequestConfig,
        moralisConfig: MoralisConfig
    ) {
        super(walletProvider, httpConfig);

        Moralis.start(moralisConfig);
    }

    async fetch(): Promise<NFTAsset[]> {
        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);

        const nfts = await Moralis.Web3API.account.getNFTs({
            address: userAddress.toString(),
            chain: `0x${network.chainId}` as any,
        });

        const nftAssets = nfts.result.map((nft) => {
            const { contract_type, token_address, name, symbol, metadata, token_id } = nft;

            this._cache[token_address] = {
                contract: this._schemas[contract_type].attach(token_address),
                schema: contract_type as NftTypes,
            };

            const nftAsset = {
                asset_contract: {
                    address: token_address,
                    name,
                    symbol,
                },
                collection: {
                    name,
                },
                token_id,
            } as NFTAsset;

            if (!metadata) {
                return nftAsset;
            }

            const parsed = JSON.parse(metadata);

            return {
                ...nftAsset,
                name: parsed.name,
                description: parsed.description,
                image_original_url: parsed.image,
                image_preview_url: parsed.image,
                image_thumbnail_url: parsed.image,
                external_link: parsed.external_url,
            } as NFTAsset;
        });

        return nftAssets;
    }
}
