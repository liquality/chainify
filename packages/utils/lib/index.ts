import 'setimmediate'
import { InvalidSecretError, InvalidExpirationError } from '@liquality/errors'
import { sha256 } from '@liquality/crypto'
import { BigNumber, Address } from '@liquality/types'

function addressToString(address: Address | string): string {
  if (typeof address === 'string') return address
  else return address.address
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function asyncSetImmediate() {
  return new Promise((resolve) => setImmediate(resolve))
}

function caseInsensitiveEqual(left: string, right: string) {
  left = left && left.toLowerCase()
  right = right && right.toLowerCase()

  return left === right
}

function validateValue(value: BigNumber) {
  if (!BigNumber.isBigNumber(value)) {
    throw new Error(`Invalid value: ${value}`)
  }

  if (value.lte(0)) {
    throw new Error(`Invalid value: ${value}`)
  }
}

function validateSecretHash(secretHash: string) {
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

function validateSecret(secret: string) {
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

function validateSecretAndHash(secret: string, secretHash: string) {
  validateSecret(secret)
  validateSecretHash(secretHash)

  const computedSecretHash = Buffer.from(sha256(secret), 'hex')
  if (!computedSecretHash.equals(Buffer.from(secretHash, 'hex'))) {
    throw new InvalidSecretError(`Invalid secret: Does not match expected secret hash: ${secretHash}`)
  }
}

function validateExpiration(expiration: number) {
  if (isNaN(expiration)) {
    throw new InvalidExpirationError(`Invalid expiration. NaN: ${expiration}`)
  }

  if (expiration < 500000000 || expiration > 5000000000000) {
    throw new InvalidExpirationError(`Invalid expiration. Out of bounds: ${expiration}`)
  }
}

export {
  sleep,
  addressToString,
  asyncSetImmediate,
  caseInsensitiveEqual,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash,
  validateExpiration
}
