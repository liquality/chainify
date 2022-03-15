import { sha256 as ethersSha256 } from '@ethersproject/sha2';
import bech32 from 'bech32';
import base58 from 'bs58';
import cryptoHash from 'crypto-hashing';
import { ensure0x, remove0x } from './hex';

/**
 * Ensure message is in buffer format.
 * @param {string} message - any string.
 * @return {string} Returns Buffer.
 */
export function ensureBuffer(message: string | Buffer | any) {
    if (Buffer.isBuffer(message)) return message;

    switch (typeof message) {
        case 'string':
            message = isHex(message) ? Buffer.from(message, 'hex') : Buffer.from(message);
            break;
        case 'object':
            message = Buffer.from(JSON.stringify(message));
            break;
    }

    return Buffer.isBuffer(message) ? message : false;
}

/**
 * Get hash160 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the hash160 of a string.
 */
export function hash160(message: string): string {
    return cryptoHash('hash160', ensureBuffer(message)).toString('hex');
}

export function sha256(data: string) {
    return remove0x(ethersSha256(ensure0x(data)));
}

export function isHex(hex: string) {
    if (!hex.match(/([0-9]|[a-f])/gim)) return false;

    const buf = Buffer.from(hex, 'hex').toString('hex');

    return buf === hex.toLowerCase();
}

/**
 * Pad a hex string with '0'
 * @param {string} hex - The hex string to pad.
 * @param {number} lengthBytes - The length of the final string in bytes
 * @return {string} Returns a padded string with length greater or equal to the given length
 *  rounded up to the nearest even number.
 */
export function padHexStart(hex: string, lengthBytes?: number) {
    let lengthString = lengthBytes * 2 || hex.length;
    lengthString += lengthString % 2;

    return hex.padStart(lengthString, '0');
}

export { base58, bech32 };
