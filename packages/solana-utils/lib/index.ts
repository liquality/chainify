import { Address } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'

export function validateAddress(_address: Address | string) {
  const address = addressToString(_address)

  if (typeof address !== 'string') {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }

  if (address.length !== 44) {
    throw new InvalidAddressError(`Invalid address. Minimum length is 2`)
  }
}
