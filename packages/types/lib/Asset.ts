import { ChainId } from '@liquality/cryptoassets';
export { ChainId } from '@liquality/cryptoassets';

export type AssetType = 'native' | 'erc20' | 'nft';

export interface Asset {
    name: string;
    code: string;
    chain: ChainId;
    isNative: boolean;
    type: AssetType;
    decimals: number;
    contractAddress?: string;
}

export interface TokenDetails {
    decimals: number;
    name: string;
    symbol: string;
}
