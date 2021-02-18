/// <reference types="node" />
import base58 from 'bs58';
import bech32 from 'bech32';
import { version } from '../package.json';
declare function isHex(hex: string): boolean;
/**
 * Ensure message is in buffer format.
 * @param {string} message - any string.
 * @return {string} Returns Buffer.
 */
declare function ensureBuffer(message: string | Buffer): false | Buffer;
/**
 * Get hash160 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the hash160 of a string.
 */
declare function hash160(message: Buffer): any;
/**
 * Get sha256 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the sha256 of a string.
 */
declare function sha256(message: string | Buffer): any;
/**
 * Get ripemd160 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the ripemd160 of a string.
 */
declare function ripemd160(message: string | Buffer): any;
/**
 * Pad a hex string with '0'
 * @param {string} hex - The hex string to pad.
 * @param {number} lengthBytes - The length of the final string in bytes
 * @return {string} Returns a padded string with length greater or equal to the given length
 *  rounded up to the nearest even number.
 */
declare function padHexStart(hex: string, lengthBytes: number): string;
export { 
/**
 * Base58 object with decode, decodeUnsafe, and encode functions.
 */
base58, 
/**
 * Get bech32 of message.
 * @param {!string} message - any string.
 * @return {string} Returns the bech32 of a string.
 */
bech32, sha256, ripemd160, hash160, ensureBuffer, padHexStart, isHex, version };
