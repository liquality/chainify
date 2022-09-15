import { NFTAsset } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import Moralis from 'moralis/node';
import { MoralisConfig, NftTypes } from '../types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmNftProvider } from './EvmNftProvider';

export class MoralisNftProvider extends EvmNftProvider {
    private _config: MoralisConfig;

    constructor(walletProvider: EvmBaseWalletProvider<BaseProvider>, config: MoralisConfig) {
        super(walletProvider);
        this._config = config;
    }

    async fetch(): Promise<NFTAsset[]> {
        // check if Moralis is already initialized
        if (!Moralis.applicationId) {
            await Moralis.start({ masterKey: this._config.apiKey, serverUrl: this._config.url, appId: this._config.appId });
        }

        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);

        const chainId = `0x${Number(network.chainId).toString(16)}`;
        const nfts = await Moralis.Web3API.account.getNFTs({
            address: userAddress.toString(),
            chain: chainId as any,
        });

        return nfts.result.reduce((result, nft) => {
            const { contract_type, token_address, name, symbol, metadata, token_id, amount } = nft;

            // we only support ERC721 & ERC1155
            if (contract_type in NftTypes && token_address) {
                this.cache[token_address] = {
                    contract: this.schemas[contract_type].attach(token_address),
                    schema: contract_type as NftTypes,
                };

                let nftAsset: NFTAsset = {
                    asset_contract: {
                        address: token_address,
                        name,
                        symbol,
                    },
                    collection: {
                        name,
                    },
                    token_id,
                    amount,
                    standard: contract_type,
                };

                if (metadata) {
                    const parsed = JSON.parse(metadata);
                    parsed.image = parsed.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    nftAsset = {
                        ...nftAsset,
                        name: parsed.name,
                        description: parsed.description,
                        image_original_url: parsed.image,
                        image_preview_url: parsed.image,
                        image_thumbnail_url: parsed.image,
                        external_link: parsed.external_url,
                    };
                }

                result.push(nftAsset);
            }
            return result;
        }, []);
    }
}
