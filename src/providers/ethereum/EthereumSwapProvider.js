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
    const dataSizeEncoded = (dataSizeBase + expirationSize).toString(16)
    const recipientAddressEncoded = recipientAddress.replace('0x', '') // Remove 0x if exists
    const refundAddressEncoded = refundAddress.replace('0x', '') // Remove 0x if exists
    const secretHashEncoded = secretHash.replace('0x', '') // Remove 0x if exists

    const bytecode = `
OP_PUSH1 ${dataSizeEncoded}
OP_DUP1
OP_PUSH1 0b
OP_PUSH1 00
OP_CODECOPY
OP_PUSH1 00
OP_RETURN



OP_PUSH1 20

OP_DUP1
OP_PUSH1 00
OP_DUP1
OP_CALLDATACOPY


OP_PUSH1 21
OP_DUP2
OP_PUSH1 00
OP_DUP1
OP_PUSH1 02
OP_PUSH1 48
OP_CALL

OP_PUSH32 ${secretHashEncoded}
OP_PUSH1 21
OP_MLOAD
OP_EQ

OP_AND

OP_PUSH1 ${redeemDestinationEncoded}
OP_JUMPI


OP_PUSH${expirationSize}
${expirationEncoded}

OP_TIMESTAMP
OP_GT

OP_PUSH1 ${refundDestinationEncoded}
OP_JUMPI


OP_STOP


OP_JUMPDEST
OP_PUSH20 ${recipientAddressEncoded}
OP_SUICIDE


OP_JUMPDEST
OP_PUSH20 ${refundAddressEncoded}
OP_SUICIDE
`

    const OPCODES = {
      OP_PUSH: 0x60 - 1,
      OP_DUP: 0x80 - 1,
      OP_CODECOPY: 0x39,
      OP_RETURN: 0xf3,
      OP_CALLDATACOPY: 0x37,
      OP_CALL: 0xf1,
      OP_MLOAD: 0x51,
      OP_EQ: 0x14,
      OP_AND: 0x16,
      OP_JUMPI: 0x57,
      OP_TIMESTAMP: 0x42,
      OP_GT: 0x11,
      OP_STOP: 0x00,
      OP_JUMPDEST: 0x5b,
      OP_SUICIDE: 0xff
    }

    return bytecode.match(/\S+/g)
      .map(op => {
        if (op.startsWith('OP_')) {
          const [opCode, mod] = op.match(/\D+|\d+/g)
          return (OPCODES[opCode] + parseInt(mod || 0))
            .toString(16)
            .padStart(2, '0')
        }
        return op
      })
      .join('')
  }
}
