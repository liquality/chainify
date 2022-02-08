import equal from 'fast-deep-equal';

export function deepEqual(a: unknown, b: unknown): boolean {
    return equal(a, b);
}
