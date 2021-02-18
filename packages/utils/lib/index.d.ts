import { version } from '../package.json';
import { Address } from './types';
declare function sleep(ms: number): Promise<unknown>;
declare function asyncSetImmediate(): Promise<unknown>;
declare function caseInsensitiveEqual(left: string, right: string): boolean;
export { Address, sleep, asyncSetImmediate, caseInsensitiveEqual, version };
