import { sha256 } from '@ethersproject/sha2';
import { BigNumberish } from '@liquality/types';
import { remove0x } from './hex';
import { lte } from './math';

export function validateExpiration(expiration: number) {
    if (isNaN(expiration)) {
        throw new Error(`Invalid expiration. NaN: ${expiration}`);
    }

    if (expiration < 500000000 || expiration > 5000000000000) {
        throw new Error(`Invalid expiration. Out of bounds: ${expiration}`);
    }
}

export function validateSecret(secret: string) {
    if (typeof secret !== 'string') {
        throw new Error(`Invalid secret type`);
    }

    if (Buffer.from(secret, 'hex').toString('hex') !== secret) {
        throw new Error(`Invalid secret. Not Hex.`);
    }

    const secretBuff = Buffer.from(secret, 'hex');
    if (secretBuff.length !== 32) {
        throw new Error(`Invalid secret size`);
    }
}

export function validateSecretHash(secretHash: string) {
    if (typeof secretHash !== 'string') {
        throw new Error(`Invalid secret hash type`);
    }

    const _secretHash = remove0x(secretHash);

    if (remove0x(Buffer.from(_secretHash, 'hex').toString('hex')) !== remove0x(_secretHash)) {
        throw new Error(`Invalid secret hash. Not Hex.`);
    }

    if (Buffer.byteLength(_secretHash, 'hex') !== 32) {
        throw new Error(`Invalid secret hash: ${_secretHash}`);
    }

    // sha256('0000000000000000000000000000000000000000000000000000000000000000')
    if ('66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925' === _secretHash) {
        throw new Error(`Invalid secret hash: ${_secretHash}. Secret 0 detected.`);
    }
}

export function validateSecretAndHash(secret: string, secretHash: string) {
    validateSecret(secret);
    validateSecretHash(secretHash);

    const computedSecretHash = Buffer.from(sha256(secret), 'hex');
    if (!computedSecretHash.equals(Buffer.from(secretHash, 'hex'))) {
        throw new Error(`Invalid secret: Does not match expected secret hash: ${secretHash}`);
    }
}

export function validateValue(value: BigNumberish) {
    if (lte(value, 0)) {
        throw new Error(`Invalid value: ${value}`);
    }
}
