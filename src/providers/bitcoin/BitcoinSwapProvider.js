import Provider from '../../Provider'

export default class BitcoinSwapProvider extends Provider {
  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    let expirationHex = expiration.toString(16)
    if (expirationHex.length % 2 === 1) {
      expirationHex = '0' + expirationHex
    }
    expirationHex = expirationHex.match(/.{2}/g).reverse()
    expirationHex.length = Math.min(expirationHex.length, 5)
    expirationHex[expirationHex.length - 1] = '00'

    const bytecode = `
OP_DUP OP_HASH160
OP_2SWAP
OP_IF
  OP_HASH160
  OP_PUSH20 ${secretHash}
  OP_EQUALVERIFY
  OP_PUSH20 ${recipientAddress}
OP_ELSE
  ${expirationHex.length.toString(16).padStart(2, '0')}
  ${expirationHex.join('')}
  OP_CHECKLOCKTIMEVERIFY
  OP_2DROP
  OP_PUSH20 ${refundAddress}
OP_ENDIF
OP_EQUALVERIFY OP_CHECKSIG
`

    const OPCODES = {
      OP_DUP: '76',
      OP_HASH160: 'a9',
      OP_2SWAP: '72',
      OP_IF: '63',
      OP_PUSH20: '14',
      OP_EQUALVERIFY: '88',
      OP_ELSE: '67',
      OP_CHECKLOCKTIMEVERIFY: 'b1',
      OP_2DROP: '6d',
      OP_ENDIF: '68',
      OP_CHECKSIG: 'ac'
    }

    return bytecode.match(/\S+/g)
      .map(op => op.startsWith('OP_') ? OPCODES[op] : op)
      .join('')
  }
}
