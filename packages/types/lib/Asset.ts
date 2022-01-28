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
}

export type AssetType = 'native' | 'erc20';

export interface Asset {
    name: string;
    chain: ChainId;
    type: AssetType;
    code: string;
    decimals: number;
    contractAddress?: string;
}
