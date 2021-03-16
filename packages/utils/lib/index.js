import 'setimmediate'
import {
  InvalidSecretError,
  InvalidExpirationError
} from '@liquality/errors'
import { sha256 } from '@liquality/crypto'

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function asyncSetImmediate () {
  return new Promise(resolve => setImmediate(resolve))
}

function caseInsensitiveEqual (left: string, right: string) {
  left = left && left.toLowerCase()
  right = right && right.toLowerCase()

  return left === right
}

function validateValue (value) {
  if (isNaN(value)) {
    throw new Error(`Invalid value: ${value}`)
  }

  if (!(value > 0)) {
    throw new Error(`Invalid value: ${value}`)
  }
}

function validateSecretHash (secretHash) {
  if (typeof secretHash !== 'string') {
    throw new InvalidSecretError(`Invalid secret hash type`)
  }

  if (Buffer.from(secretHash, 'hex').toString('hex') !== secretHash) {
    throw new InvalidSecretError(`Invalid secret hash. Not Hex.`)
  }

  if (Buffer.byteLength(secretHash, 'hex') !== 32) {
    throw new InvalidSecretError(`Invalid secret hash: ${secretHash}`)
  }

  if (sha256('0000000000000000000000000000000000000000000000000000000000000000') === secretHash) {
    throw new InvalidSecretError(`Invalid secret hash: ${secretHash}. Secret 0 detected.`)
  }
}

function validateSecret (secret) {
  if (typeof secret !== 'string') {
    throw new InvalidSecretError(`Invalid secret type`)
  }

  if (Buffer.from(secret, 'hex').toString('hex') !== secret) {
    throw new InvalidSecretError(`Invalid secret. Not Hex.`)
  }

  const secretBuff = Buffer.from(secret, 'hex')
  if (secretBuff.length !== 32) {
    throw new InvalidSecretError(`Invalid secret size`)
  }
}

function validateSecretAndHash (secret, secretHash) {
  validateSecret(secret)
  validateSecretHash(secretHash)

  const computedSecretHash = Buffer.from(sha256(secret), 'hex')
  if (!computedSecretHash.equals(Buffer.from(secretHash, 'hex'))) {
    throw new InvalidSecretError(`Invalid secret: Does not match expected secret hash: ${secretHash}`)
  }
}

function validateExpiration (expiration) {
  if (isNaN(expiration)) {
    throw new InvalidExpirationError(`Invalid expiration. NaN: ${expiration}`)
  }

  if (expiration < 500000000 || expiration > 5000000000000) {
    throw new InvalidExpirationError(`Invalid expiration. Out of bounds: ${expiration}`)
  }
}

export {
  sleep,
  asyncSetImmediate,
  caseInsensitiveEqual,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash,
  validateExpiration
}
