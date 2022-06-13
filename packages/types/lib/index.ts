import { BigNumberish as EthersBigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export * from './Address';
export * from './Asset';
export * from './Block';
export * from './Chain';
export * from './Fees';
export * from './Network';
export * from './Nft';
export * from './Swap';
export * from './Transaction';
export * from './Wallet';
export { BigNumber };

export type BigNumberish = string | number | EthersBigNumberish | BigNumber;

export type Nullable<T> = T | null;
