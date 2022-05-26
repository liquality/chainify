import { ChainId } from '@liquality/cryptoassets';
export { ChainId } from '@liquality/cryptoassets';

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
