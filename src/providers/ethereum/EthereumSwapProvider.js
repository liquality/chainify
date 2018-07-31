import Provider from '../../Provider'

export default class EthereumSwapProvider extends Provider {
  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    const dataSizeBase = 112
    const redeemDestinationBase = 66
    const refundDestinationBase = 89
    const expirationHex = expiration.toString(16)
    const expirationEncoded = expirationHex.length % 2 ? '0' + expirationHex : expirationHex // Pad with 0
    const expirationSize = expirationEncoded.length / 2
    const redeemDestinationEncoded = (redeemDestinationBase + expirationSize).toString(16)
    const refundDestinationEncoded = (refundDestinationBase + expirationSize).toString(16)
    const expirationPushOpcode = (0x5f + expirationSize).toString(16)
    const dataSizeEncoded = (dataSizeBase + expirationSize).toString(16)
    const recipientAddressEncoded = recipientAddress.replace('0x', '') // Remove 0x if exists
    const refundAddressEncoded = refundAddress.replace('0x', '') // Remove 0x if exists
    const secretHashEncoded = secretHash.replace('0x', '') // Remove 0x if exists
    return `60${dataSizeEncoded}80600b6000396000f36020806000803760218160008060026048f17f\
${secretHashEncoded}602151141660${redeemDestinationEncoded}57\
${expirationPushOpcode}${expirationEncoded}421160${refundDestinationEncoded}\
57005b73${recipientAddressEncoded}ff5b73${refundAddressEncoded}ff`
  }
}
