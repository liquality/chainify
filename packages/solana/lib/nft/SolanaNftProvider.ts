import { HttpClient, Nft, Wallet } from '@chainify/client';
import { AddressType, BigNumber, ChainId, NFTAsset, Transaction } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import { SolanaWalletProvider } from 'lib/wallet/SolanaWalletProvider';
import Moralis from 'moralis/node';
import { parseToNFTAsset } from '../utils';
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

        nftBalance.map(async (nft) => {
            const metadataOptions = {
                ...nftsOptions,
                address: nft.mint,
            };

            const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(metadataOptions);
            const data = await this._httpClient.nodeGet(nftMetadata.metaplex.metadataUri);

            const nftAsset = parseToNFTAsset(data, nft);

            nftAssets.push(nftAsset);
        });

        return nftAssets;
    }

    async transfer(contract: AddressType, receiver: AddressType): Promise<Transaction<any>> {
        return await this.walletProvider.sendTransaction({
            to: receiver,
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

    balanceOf(contractAddress: AddressType, owners: AddressType[], tokenIDs: number[]): Promise<BigNumber | BigNumber[]> {
        throw new Error('Method not implemented.');
    }
    approve(contract: AddressType, operator: AddressType, tokenID: number): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }
    approveAll(contract: AddressType, operator: AddressType, state: boolean): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }
    isApprovedForAll(contract: AddressType, operator: AddressType): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
