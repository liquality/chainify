import { BigNumberish, BigNumber } from '@liquality/types';

export function add(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).plus(b.toString());
}

export function sub(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).minus(b.toString());
}

export function mul(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).multipliedBy(b.toString());
}

export function eq(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).eq(b.toString());
}

export function lte(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).lte(b.toString());
}

export function gte(a: BigNumberish, b: BigNumberish) {
    return new BigNumber(a.toString()).gte(b.toString());
}
