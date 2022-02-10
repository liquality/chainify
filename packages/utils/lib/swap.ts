import { sha256 as ethersSha256 } from '@ethersproject/sha2';
import { InvalidExpirationError, InvalidSecretError, InvalidValueError } from '@liquality/errors';

import { BigNumberish } from '@liquality/types';

import { ensure0x, remove0x } from './hex';
import { lte } from './math';

export function validateExpiration(expiration: number) {
    if (isNaN(expiration)) {
        throw new InvalidExpirationError(`Invalid expiration. NaN: ${expiration}`);
    }

    if (expiration < 500000000 || expiration > 5000000000000) {
        throw new InvalidExpirationError(`Invalid expiration. Out of bounds: ${expiration}`);
    }
}

export function validateSecret(secret: string) {
    if (typeof secret !== 'string') {
        throw new InvalidSecretError(`Invalid secret type`);
    }

    const _secret = remove0x(secret);

    if (Buffer.from(_secret, 'hex').toString('hex') !== _secret) {
        throw new InvalidSecretError(`Invalid secret. Not Hex.`);
    }

    const secretBuff = Buffer.from(_secret, 'hex');
    if (secretBuff.length !== 32) {
        throw new InvalidSecretError(`Invalid secret size`);
    }
}

export function validateSecretHash(secretHash: string) {
    if (typeof secretHash !== 'string') {
        throw new InvalidSecretError(`Invalid secret hash type`);
    }

    const _secretHash = remove0x(secretHash);

    if (remove0x(Buffer.from(_secretHash, 'hex').toString('hex')) !== remove0x(_secretHash)) {
        throw new InvalidSecretError(`Invalid secret hash. Not Hex.`);
    }

    if (Buffer.byteLength(_secretHash, 'hex') !== 32) {
        throw new InvalidSecretError(`Invalid secret hash: ${_secretHash}`);
    }

    // sha256('0000000000000000000000000000000000000000000000000000000000000000')
    if ('66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925' === _secretHash) {
        throw new InvalidSecretError(`Invalid secret hash: ${_secretHash}. Secret 0 detected.`);
    }
}

export function validateSecretAndHash(secret: string, secretHash: string) {
    validateSecret(secret);
    validateSecretHash(secretHash);

    const computedSecretHash = Buffer.from(sha256(secret), 'hex');
    if (!computedSecretHash.equals(Buffer.from(remove0x(secretHash), 'hex'))) {
        throw new InvalidSecretError(`Invalid secret: Does not match expected secret hash: ${secretHash}`);
    }
}

export function validateValue(value: BigNumberish) {
    if (lte(value, 0)) {
        throw new InvalidValueError(`Invalid value: ${value}`);
    }
}

export function sha256(data: string) {
    return remove0x(ethersSha256(ensure0x(data)));
}
