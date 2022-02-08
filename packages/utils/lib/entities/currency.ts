import { ChainId, AssetType, Asset } from '@liquality/types';
import { deepEqual } from '../equals';

export class Currency implements Asset {
    public readonly name: string;
    public readonly chain: ChainId;
    public readonly isNative: boolean;
    public readonly type: AssetType;
    public readonly decimals: number;
    public readonly contractAddress?: string;
    public readonly symbol?: string;

    protected constructor(fields?: Asset) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

    public isERC20(): boolean {
        return this.isNative ? false : true;
    }

    public isNativeAsset(): boolean {
        return this.isNative ? true : false;
    }

    public equals(other: Currency): boolean {
        return deepEqual(this, other);
    }
}
