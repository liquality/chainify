import { HttpClient, Nft, Wallet } from '@chainify/client';
import { UnsupportedMethodError } from '@chainify/errors';
import { AddressType, BigNumber, ChainId, NFTAsset, Transaction } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import Moralis from 'moralis/node';
import { SolanaWalletProvider } from '../wallet/SolanaWalletProvider';

type MoralisConfig = {
    url: string;
    apiKey: string;
    appId: string;
};

export class SolanaNftProvider extends Nft<BaseProvider, SolanaWalletProvider> {
    private _config: MoralisConfig;
    private readonly _httpClient: HttpClient;

    constructor(walletProvider: Wallet<BaseProvider, SolanaWalletProvider>, config: MoralisConfig) {
        super(walletProvider);
        this._config = config;
        this._httpClient = new HttpClient({});
    }

    async fetch(): Promise<NFTAsset[]> {
        if (!Moralis.applicationId) {
            await Moralis.start({ masterKey: this._config.apiKey, serverUrl: this._config.url, appId: this._config.appId });
        }

        const [userAddress, network] = await Promise.all([this.walletProvider.getAddress(), this.walletProvider.getConnectedNetwork()]);
        const nftsOptions = {
            address: userAddress.toString(),
            network: network.isTestnet ? 'devnet' : ('mainnet' as any),
        };
        const nftBalance = await Moralis.SolanaAPI.account.getNFTs(nftsOptions);

        const nftAssets: NFTAsset[] = [];

        for (const nft of nftBalance) {
            const metadataOptions = {
                ...nftsOptions,
                address: nft.mint,
            };

            const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(metadataOptions);

            const { mint, symbol } = nftMetadata;
            try {
                const data = await this._httpClient.nodeGet(nftMetadata.metaplex.metadataUri);
                const nftAsset = {
                    token_id: data.edition,
                    asset_contract: {
                        address: mint,
                        name: data.name,
                        symbol: symbol,
                        image_url: data.image,
                        external_link: data.external_url,
                    },
                    collection: {
                        name: data.collection?.name || data.name,
                    },
                    description: data.description,
                    external_link: data.external_url,
                    image_original_url: data.image,
                    image_preview_url: data.image,
                    image_thumbnail_url: data.image,
                    name: data.name,
                };

                nftAssets.push(nftAsset);
            } catch (err) {
                nftAssets.push({ asset_contract: { address: mint, symbol }, collection: { name: symbol } });
            }
        }

        return nftAssets;
    }

    async transfer(contract: AddressType, receiver: AddressType): Promise<Transaction<any>> {
        return await this.walletProvider.sendTransaction({
            to: receiver,
            value: new BigNumber(1), // transfer 1 nft
            asset: {
                contractAddress: contract.toString(),
                isNative: false,
                chain: ChainId.Solana,
                decimals: 0,
                code: '',
                name: '',
                type: 'nft',
            },
        });
    }

    balanceOf(_contractAddress: AddressType, _owners: AddressType[], _tokenIDs: number[]): Promise<BigNumber | BigNumber[]> {
        throw new UnsupportedMethodError('Method not supported');
    }
    approve(_contract: AddressType, _operator: AddressType, _tokenID: number): Promise<Transaction<any>> {
        throw new UnsupportedMethodError('Method not supported');
    }
    approveAll(_contract: AddressType, _operator: AddressType, _state: boolean): Promise<Transaction<any>> {
        throw new UnsupportedMethodError('Method not supported');
    }
    isApprovedForAll(_contract: AddressType, _operator: AddressType): Promise<boolean> {
        throw new UnsupportedMethodError('Method not supported');
    }
}
