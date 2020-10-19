
import { expect } from 'chai'
import * as liquid from 'liquidjs-lib'
import liquidNetworks from '../../packages/liquid-networks/lib/index'
import LiquidJsWalletProvider from '../../packages/liquid-js-wallet-provider/lib/index'

import fixtures from './fixtures.json'

describe('liquid-wallet-provider', () => {
  const mnemonic = 'unique chef tool note evoke stem uncover buzz fit spin actual leopard'
  const regtest = liquidNetworks.liquid_regtest

  const LBTC = Buffer.concat([
    Buffer.from('01', 'hex'), // prefix for unconfidential asset
    Buffer.from(regtest.assetHash, 'hex').reverse()
  ])

  it('returns 2 confidential blech32 addresses', async () => {
    const provider = new LiquidJsWalletProvider(regtest, mnemonic, 'blech32')
    const addrs = await provider.getConfidentialAddresses(0, 2, false)

    expect(addrs[0].address).to.equal('el1qqgqvl73vnulxfgkf65msus7nygwk6mdjnxy6m6p67qtqf0yh3nuvfhjtmsd9tjqxl34ysz06dcudc3em70t2vmrtdtwmmntwp')
    expect(addrs[1].address).to.equal('el1qqgdsyjne07tdj6ellxyhu3jwxyfprsugcwlkvjwhk92cp760w753jchvhlmtf09karck0rsezp5c7kwx6utlydf9u0zdkwre8')
  })

  it('returns 2 unconfidential bech32 addresses', async () => {
    const provider = new LiquidJsWalletProvider(regtest, mnemonic, 'bech32')
    const addrs = await provider.getAddresses(0, 2, false)

    expect(addrs[0].address).to.equal('ert1qme9acxj4eqr0c6jgp8axuwxugual844xyt3jgg')
    expect(addrs[1].address).to.equal('ert1qvtktla45hjmw3ut83cv3q6v0t8rdw9ljr9usg7')
  })

  it(' blinds and sign a given PSET', async () => {
    const provider = new LiquidJsWalletProvider(
      regtest,
      mnemonic,
      'blech32'
    )

    const alice = (await provider.getConfidentialAddresses(0, 1, false))[0]
    const alicePayment = provider.getPaymentVariantFromPublicKey(alice.publicKey, alice.blindingPublicKey)

    const bobKeyPair = liquid.ECPair.fromWIF('cQww96qconHhyev7g6V1Gebrgvvkva8xRHYWm3jHRNkoBMF38uSB', regtest)
    const bobBlindingKeyPair = liquid.ECPair.fromWIF('cUQfbMe1Hy6246oHP3x5LXLzVC5oQqMUT1bcsKHUWfzH8ecNQPtb', regtest)

    const bobPayment = liquid.payments.p2wpkh({
      pubkey: bobKeyPair.publicKey,
      blindkey: bobBlindingKeyPair.publicKey,
      network: regtest
    })

    const prevTx = liquid.Transaction.fromHex(fixtures.hex)
    const witnessUtxo = prevTx.outs[1]

    const inputs = [{
      hash: Buffer.from('6ab70ea746586216ddcfee1218670c026ae472ee8d27b298531fab1ee430d776', 'hex').reverse(),
      index: 1,
      witnessUtxo
    }]

    const outputs = [{
      asset: LBTC,
      script: bobPayment.output,
      value: liquid.confidential.satoshiToConfidentialValue(50000000),
      nonce: Buffer.from('00', 'hex')
    }, // the actual spend
    {
      asset: LBTC,
      script: alicePayment.output,
      value: liquid.confidential.satoshiToConfidentialValue(49993000),
      nonce: Buffer.from('00', 'hex')
    },
    {
      asset: LBTC,
      script: Buffer.alloc(0),
      value: liquid.confidential.satoshiToConfidentialValue(7000),
      nonce: Buffer.from('00', 'hex')
    }]

    const emptyPset = provider.createPset()
    const updatedPset = provider.updatePset(emptyPset, inputs, outputs)
    const blindedPset = await provider.blindPset(
      updatedPset,
      [alicePayment.confidentialAddress],
      [bobPayment.confidentialAddress, alicePayment.confidentialAddress]
    )

    const signedPset = await provider.signPset(
      blindedPset,
      [alicePayment.confidentialAddress]
    )

    const finalized = provider.finalizePset(signedPset)

    expect(finalized.length).to.greaterThan(0)
  })
})
