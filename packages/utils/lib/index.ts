import 'setimmediate';
export * from './hex';
export * as Math from './math';
export * from './string';
export * from './swap';

export function asyncSetImmediate() {
    return new Promise((resolve) => setImmediate(resolve));
}
