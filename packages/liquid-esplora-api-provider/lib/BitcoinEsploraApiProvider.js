import BitcoinEsploraApiProvider from '@liquality/bitcoin-esplora-api-provider'
const ljs = require('liquidjs-lib')
import { version } from '../package.json'

export default 
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

BitcoinEsploraApiProvider.version = version
