const LiquidJsWalletProvider = require('../../packages/liquid-js-wallet-provider/dist/index.cjs')
const LiquidNetworks = require('../../packages/liquid-networks/dist/index.cjs')
const BitcoinEsploraApiProvider = require('../../packages/bitcoin-esplora-api-provider/dist/index.cjs')
const Client = require('../../packages/client/dist/index.cjs')
const ljs = require('liquidjs-lib')

class LiquidEsploraApiProvider extends BitcoinEsploraApiProvider {
  async _getUnspentTransactions (address) {
    const utxos = await super._getUnspentTransactions(address)
    for (const index in utxos) {
      const utxo = utxos[index]
      const prevoutHex = await this.getTransactionHex(utxo.txid);
      const walletAddress = await this.getMethod('getWalletAddress')(address)
      const prevout = ljs.Transaction.fromHex(prevoutHex).outs[utxo.vout];
      const payment = ljs.payments.p2wpkh({ pubkey: walletAddress.publicKey, blindkey: walletAddress.blindingPublicKey, network: this._network }) // TODO: other pay types
      const unblindedUtxo = ljs.confidential.unblindOutput(
        Buffer.from(utxo.noncecommitment, 'hex'),
        walletAddress.blindingPrivateKey,
        prevout.rangeProof,
        Buffer.from(utxo.valuecommitment, 'hex'),
        Buffer.from(utxo.assetcommitment, 'hex'),
        payment.output
      );
      utxos[index] = {
        ...utxo,
        amount: parseInt(unblindedUtxo.value) / 1e8,
        satoshis: parseInt(unblindedUtxo.value)
      }
    }
    return utxos
  }

  async getMinRelayFee () {
    return 1
  }
}

const js = new LiquidJsWalletProvider(LiquidNetworks.liquid_regtest, 'draft infant assume world image edge chalk ocean absent copy coast river')
const api = new LiquidEsploraApiProvider('http://localhost:3012/', LiquidNetworks.liquid_regtest)

const client = new Client()
client.addProvider(api)
client.addProvider(js)


;(async function () {
  try{
    const addresses = await client.wallet.getUsedAddresses()
    console.log(addresses)
    const utxos = await api.getUnspentTransactions(addresses)
    console.log(utxos)

    console.log((await client.chain.getBalance(addresses)).toNumber())
    console.log(await client.wallet.getUnusedAddress())
    const { inputs, change, fee } = await client.getMethod('getInputsForAmount')([{
      nonce: Buffer.from('00', 'hex'),
      to: 'whoever',
      value: 100000,
      asset: LiquidNetworks.liquid_regtest.assetHash
    }], 0)
    console.log({inputs, change, fee})
  } catch (e) {
    console.error(e)
  }
})()