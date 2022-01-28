import { BigNumberish, BigNumber } from '@liquality/types';

export function add(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a).plus(b);
}

export function sub(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a).minus(b);
}

export function eq(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a).eq(b);
}
