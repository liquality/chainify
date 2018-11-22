import { flatten } from 'lodash'
import { pubKeyToAddress, addressToPubKeyHash } from '../bitcoin/BitcoinUtil'
import { base58, padHexStart } from '../../crypto'
import networks from '../../networks'

import BitcoinRPCProvider from '../bitcoin/BitcoinRPCProvider'


export default class Bitcore extends BitcoinRPCProvider {

  createVarint(value) {
      if (value < 0xfd) {
        const buffer = Buffer.alloc(1);
        buffer[0] = value;
        return buffer;
      }
      if (value <= 0xffff) {
        const buffer = Buffer.alloc(3);
        buffer[0] = 0xfd;
        buffer[1] = value & 0xff;
        buffer[2] = (value >> 8) & 0xff;
        return buffer;
      }
      const buffer = Buffer.alloc(5);
      buffer[0] = 0xfe;
      buffer[1] = value & 0xff;
      buffer[2] = (value >> 8) & 0xff;
      buffer[3] = (value >> 16) & 0xff;
      buffer[4] = (value >> 24) & 0xff;
      return buffer;
    }
  serializeTransactionOutputs(outputs) {
    outputs = outputs.outputs
     let outputBuffer = Buffer.alloc(0);
     if (typeof outputs !== "undefined") {
       outputBuffer = Buffer.concat([
         outputBuffer,
         this.createVarint(outputs.length)
       ]);
       outputs.forEach(output => {
         outputBuffer = Buffer.concat([
           outputBuffer,
           output.amount,
           this.createVarint(output.script.length),
           output.script
         ]);
       });
     }
     return outputBuffer;
   }
  calculateFee (numInputs, numOutputs, feePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * feePerByte
  }
  getVarint(data, offset) {
      if (data[offset] < 0xfd) {
        return [data[offset], 1];
      }
      if (data[offset] === 0xfd) {
        return [(data[offset + 2] << 8) + data[offset + 1], 3];
      }
      if (data[offset] === 0xfe) {
        return [
          (data[offset + 4] << 24) +
            (data[offset + 3] << 16) +
            (data[offset + 2] << 8) +
            data[offset + 1],
          5
        ];
      }

      throw new Error("getVarint called with unexpected parameters");
  }

  async signP2SHTransaction (inputs, associatedKeysets, changePath, outputScriptHex) {
    return null
    //return app.signP2SHTransaction(inputs, associatedKeysets, changePath, outputScriptHex)
  }

  getDerivationPathFromAddress () {
    return null
  }
  createScript (address) {
    const type = base58.decode(address).toString('hex').substring(0, 2).toUpperCase()
    const pubKeyHash = addressToPubKeyHash(address)
    if (type === networks.bitcoin_testnet.pubKeyHash) {
      return [
        '76', // OP_DUP
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '88', // OP_EQUALVERIFY
        'ac' // OP_CHECKSIG
      ].join('')
    } else if (type === networks.bitcoin_testnet.scriptHash) {
      return [
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '87' // OP_EQUAL
      ].join('')
    } else {
      throw new Error('Not a valid address:', address)
    }
  }

  _splitTransaction(
   transactionHex,
   isSegwitSupported = false,
   hasTimestamp = false,
   hasExtraData = false,
   additionals = []
  ) {
   const inputs = [];
   const outputs = [];
   var witness = false;
   let offset = 0;
   let timestamp = Buffer.alloc(0);
   let nExpiryHeight = Buffer.alloc(0);
   let nVersionGroupId = Buffer.alloc(0);
   let extraData = Buffer.alloc(0);
   const isDecred = additionals.includes("decred");
   const transaction = Buffer.from(transactionHex, "hex");
   const version = transaction.slice(offset, offset + 4);
   const overwinter =
     version.equals(Buffer.from([0x03, 0x00, 0x00, 0x80])) ||
     version.equals(Buffer.from([0x04, 0x00, 0x00, 0x80]));
   offset += 4;
   if (
     !hasTimestamp &&
     isSegwitSupported &&
     (transaction[offset] === 0 && transaction[offset + 1] !== 0)
   ) {
     offset += 2;
     witness = true;
   }
   if (hasTimestamp) {
     timestamp = transaction.slice(offset, 4 + offset);
     offset += 4;
   }
   if (overwinter) {
     nVersionGroupId = transaction.slice(offset, 4 + offset);
     offset += 4;
   }
   let varint = this.getVarint(transaction, offset);
   const numberInputs = varint[0];
   offset += varint[1];
   for (let i = 0; i < numberInputs; i++) {
     const prevout = transaction.slice(offset, offset + 36);
     offset += 36;
     varint = this.getVarint(transaction, offset);
     offset += varint[1];
     const script = transaction.slice(offset, offset + varint[0]);
     offset += varint[0];
     const sequence = transaction.slice(offset, offset + 4);
     offset += 4;
     inputs.push({ prevout, script, sequence });
   }
   varint = this.getVarint(transaction, offset);
   const numberOutputs = varint[0];
   offset += varint[1];
   for (let i = 0; i < numberOutputs; i++) {
     const amount = transaction.slice(offset, offset + 8);
     offset += 8;

     if (isDecred) {
       //Script version
       offset += 2;
     }

     varint = this.getVarint(transaction, offset);
     offset += varint[1];
     const script = transaction.slice(offset, offset + varint[0]);
     offset += varint[0];
     outputs.push({ amount, script });
   }
   let witnessScript, locktime;
   if (witness) {
     witnessScript = transaction.slice(offset, -4);
     locktime = transaction.slice(transaction.length - 4);
   } else {
     locktime = transaction.slice(offset, offset + 4);
   }
   offset += 4;
   if (overwinter || isDecred) {
     nExpiryHeight = transaction.slice(offset, offset + 4);
     offset += 4;
   }
   if (hasExtraData) {
     extraData = transaction.slice(offset);
   }

   return {
     version,
     inputs,
     outputs,
     locktime,
     witness: witnessScript,
     timestamp,
     nVersionGroupId,
     nExpiryHeight,
     extraData
   };
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const _utxos = await this.getUnspentTransactionsForAddresses(addresses)
    const utxos = flatten(_utxos)
    return utxos.reduce((acc, utxo) => acc + (utxo.satoshis), 0)
  }
//  return this.getMethod('sendTransaction')(p2shAddress, value, script)

  async sendTransaction (p2shAddress, value, script) {
/*    var to = false
    if (script) {
      const scriptPubKey = padHexStart(script)
      to = pubKeyToAddress(script, networks.bitcoin_testnet.name, 'scriptHash')

    }*/
    value = value / 1e8
    return this.jsonrpc('sendtoaddress', p2shAddress, value)
  }

  async signMessage (message, address) {
    return new Promise((resolve, reject) => {
      this.jsonrpc('signmessage', address, message).then(result => {
        resolve(Buffer.from(result, 'base64'))
      })
    })
  }

  async splitTransaction (transactionHex, isSegwitSupported) {
    return this._splitTransaction(transactionHex, isSegwitSupported)
  }

  async getNewAddress (from = {}) {
    return this.jsonrpc('getnewaddress')
    /*return new Promise((resolve, reject) => {
      this.jsonrpc('getnewaddress').then(result => {
        console.log("Resolve", JSON.parse(JSON.stringify({address:result})))
        resolve(JSON.stringify({'address':result}))
      })
    })*/
  }

  async getUnusedAddress (from = {}) {
    return this.getNewAddress()
  }

  async dumpPrivKey(address) {
    return this.jsonrpc('dumpprivkey', address)
  }

  async signRawTransaction(hexstring, prevtxs, privatekeys, sighashtype) {
    return this.jsonrpc('signrawtransaction', hexstring, prevtxs, privatekeys)
  }
/*  async getAddresses() {
    return this.jsonrpc('listaddressgroupings')
  }
*/

  async createRawTransaction(transactions, outputs) {
    return this.jsonrpc('createrawtransaction', transactions, outputs)
  }

  async isAddressUsed (address) {
    address = String(address)
    const data = await this.getAddressBalance(address)

    return data.received !== 0
  }

  async getAddressBalance (address) {
    return this.jsonrpc('getaddressbalance', {'addresses': [address]})
  }

  async getUnspentTransactionsForAddresses (addresses) {
    return this.jsonrpc('getaddressutxos', {'addresses': addresses})
  }

  async getUnspentTransactions (address) {
    return this.jsonrpc('getaddressutxos', {'addresses': [address]})
  }

  async getAddressUtxos (addresses) {
    return this.jsonrpc('getaddressutxos', {'addresses': addresses})
  }

  async getTransactionHex (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)
    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }
    return output
  }



}
