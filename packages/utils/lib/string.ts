import { BigNumberish } from '@liquality/types';

export function compare(a: BigNumberish, b: BigNumberish) {
    return a?.toString().toLowerCase() === b?.toString().toLowerCase();
}

export function toStringDeep<I, O>(input: I): O {
    const newObj: O = {} as O;
    Object.keys(input).map((k) => {
        if ((input as any)[k]?.toString) {
            (newObj as any)[k] = (input as any)[k].toString();
        } else {
            (newObj as any)[k] = (input as any)[k];
        }
    });
    return newObj;
}
