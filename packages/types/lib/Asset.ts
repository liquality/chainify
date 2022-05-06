export enum ChainId {
    Bitcoin = 'bitcoin',
    BitcoinCash = 'bitcoin_cash',
    Ethereum = 'ethereum',
    Rootstock = 'rsk',
    BinanceSmartChain = 'bsc',
    Near = 'near',
    Polygon = 'polygon',
    Arbitrum = 'arbitrum',
    Solana = 'solana',
    Fuse = 'fuse',
    Terra = 'terra',
    Optimism = 'optimism',
}

export type AssetType = 'native' | 'erc20';

export interface Asset {
    name: string;
    code: string;
    chain: ChainId;
    isNative: boolean;
    type: AssetType;
    decimals: number;
    contractAddress?: string;
}
