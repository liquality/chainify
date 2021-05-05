// Disable version guard
// @ts-ignore
global._bitcoreCash = global._bitcore = undefined;

import * as bitcoreCash from 'bitcore-lib-cash'

// @ts-ignore
global._bitcoreCash = global._bitcore = undefined;

var inherits = require("inherits");

const bcDeps = (bitcoreCash as any).deps;
const bcScript = bitcoreCash.Script;
const bcTransaction = bitcoreCash.Transaction;
const bcSignature = (bitcoreCash as any).Signature;
const bcUtil = (bitcoreCash as any).util;
const bcOpcode = (bitcoreCash as any).Opcode;
const bcCrypto = bitcoreCash.crypto;

// Based on code for MultisigScriptHash

/**
 * @constructor
 */
function SwapScriptHashInput(input: any, secretHash: Buffer, recipientPkh: Buffer, refundPkh: Buffer, expiration: number, secret?: Buffer, signatures?: any) {
  // @ts-ignore
  bcTransaction.Input.apply(this, arguments);
  // @ts-ignore
  var self = this;
  // @ts-ignore
  this.secretHash = secretHash
  // @ts-ignore
  this.recipientPkh = recipientPkh
  // @ts-ignore
  this.refundPkh = refundPkh
  // @ts-ignore
  this.expiration = expiration
  // @ts-ignore
  this.redeemScript = buildSwapOut(secretHash, recipientPkh, refundPkh, expiration);
  // @ts-ignore
  if (!bcScript.buildScriptHashOut(this.redeemScript).equals(this.output.script)) {
    // @ts-ignore
    throw new Error('Output does not hash correctly. Expected: ' + this.output.script.toHex() + ' Actual: ' + bcScript.buildScriptHashOut(this.redeemScript).toHex())
  }

  if (secret) {
    // @ts-ignore
    this.secret = secret
  }

  // Empty array of signatures
  // @ts-ignore
  this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(1);
}
inherits(SwapScriptHashInput, bcTransaction.Input);

SwapScriptHashInput.prototype.toObject = function() {
  throw new Error("toObject unimplemented for P2SH swap inputs!")
};

SwapScriptHashInput.prototype._deserializeSignatures = function(signatures: any) {
  return bcDeps._.map(signatures, function(signature: any) {
    if (!signature) {
      return undefined;
    }
    return new (bcTransaction as any).Signature(signature);
  });
};

SwapScriptHashInput.prototype._serializeSignatures = function() {
  return bcDeps._.map(this.signatures, function(signature: any) {
    if (!signature) {
      return undefined;
    }
    return signature.toObject();
  });
};

SwapScriptHashInput.prototype.getSignatures = function(transaction: any, privateKey: any, index: any, sigtype: any, hashData: any, signingMethod: any) {
  hashData as any;
  if (!(this.output instanceof bcTransaction.Output)) {
    throw new Error("this.output is not of type Transaction.Output!")
  }
  sigtype = sigtype || (bcSignature.SIGHASH_ALL | bcSignature.SIGHASH_FORKID);
  hashData = /*hashData ||*/ bcCrypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer());

  if (bcUtil.buffer.equals(hashData, this.recipientPkh) || bcUtil.buffer.equals(hashData, this.refundPkh)) {
    this.publicKey = privateKey.publicKey.toBuffer();
    const signat = (bcTransaction as any).Sighash.sign(transaction, privateKey, sigtype, index, this.redeemScript, this.output.satoshisBN, undefined, signingMethod)

    return [new (bcTransaction as any).Signature({
      publicKey: privateKey.publicKey,
      prevTxId: this.prevTxId,
      outputIndex: this.outputIndex,
      inputIndex: index,
      signature: signat,
      sigtype: sigtype
    })];
  }
  return [];
};

SwapScriptHashInput.prototype.addSignature = function(transaction: any, signature: any, signingMethod: any) {
  if (this.isFullySigned()) {
    throw new Error("All needed signatures have already been added")
  }
  const publicKey = signature.publicKey.toBuffer()
  let hashData = bcCrypto.Hash.sha256ripemd160(publicKey);
  if (!bcUtil.buffer.equals(hashData, this.recipientPkh) && !bcUtil.buffer.equals(hashData, this.refundPkh)) {
    throw new Error("Signature has no matching public key")
  }
  if (!this.isValidSignature(transaction, signature, signingMethod)) {
    throw new Error("Invalid signature")
  }
  this.publicKey = publicKey
  this.signatures[0] = signature;
  this._updateScript(signingMethod);
  return this;
};

SwapScriptHashInput.prototype._updateScript = function(signingMethod: any) {
  this.setScript(buildP2SHSwapIn(
    this.secretHash,
    this.recipientPkh,
    this.refundPkh,
    this.expiration,
    this.publicKey,
    this.secret,
    this._createSignatures(signingMethod)
  ));
  return this;
};

SwapScriptHashInput.prototype._createSignatures = function(signingMethod: any) {
  return bcDeps._.map(
    bcDeps._.filter(this.signatures, function(signature: any) { return !bcDeps._.isUndefined(signature); }),
    function(signature: any) {
      return bcUtil.buffer.concat([
        signature.signature.toDER(signingMethod),
        bcUtil.buffer.integerAsSingleByteBuffer(signature.sigtype)
      ]);
    }
  );
};

SwapScriptHashInput.prototype.clearSignatures = function() {
  this.signatures = new Array(1);
  this.publicKey = undefined
  this._updateScript();
};

SwapScriptHashInput.prototype.isFullySigned = function() {
  return this.countSignatures() === 1;
};

SwapScriptHashInput.prototype.countMissingSignatures = function() {
  return 1 - this.countSignatures();
};

SwapScriptHashInput.prototype.countSignatures = function() {
  return bcDeps._.reduce(this.signatures, function(sum: any, signature: any) {
    return sum + (!!signature);
  }, 0);
};

SwapScriptHashInput.prototype.isValidSignature = function(transaction: any, signature: any, signingMethod: any) {
  signingMethod = signingMethod || "ecdsa";
  signature.signature.nhashtype = signature.sigtype;
  return (bcTransaction as any).Sighash.verify(
    transaction,
    signature.signature,
    signature.publicKey,
    signature.inputIndex,
    this.redeemScript,
    this.output.satoshisBN,
    undefined,
    signingMethod
  );
};

SwapScriptHashInput.prototype._estimateSize = function() {
  return 142;
};

function buildP2SHSwapIn(secretHash: Buffer, recipientPkh: Buffer, refundPkh: Buffer, expiration: number, publicKey: any, secret: any, signatures: any[]) {
  if (!bcUtil.buffer.isBuffer(signatures[0]) || signatures.length != 1) {
    throw new Error("Signatures must be an Array(1) of Buffers")
  }
  var s = bcScript.empty()
    .add(signatures[0])
    .add(publicKey)

  if (secret) {
    s.add(secret)
      .add(bcOpcode.OP_TRUE)
  } else {
    s.add(bcOpcode.OP_FALSE)
  }
  s.add(
    buildSwapOut(secretHash, recipientPkh, refundPkh, expiration).toBuffer()
  );
  return s;
};

function encodeExpiration(expiration: number) {
  if (expiration >= Math.pow(2, 40) || expiration < 1) {
    throw new Error("invalid expiration")
  }

  let buf2 = Buffer.allocUnsafe(4);
  buf2.writeUInt32LE(Math.floor(expiration / 256))
  let buf1 = Buffer.allocUnsafe(1);
  buf1[0] = expiration % 256
  let finalBuf: Buffer = bcUtil.buffer.concat([
    buf1,
    buf2
  ])
  let lastZero = finalBuf.length - 1
  for (; lastZero >= 0; lastZero--) {
    if (finalBuf[lastZero] != 0) {
      lastZero++
      break
    }
  }
  // It is impossible that lastZero < 1
  return finalBuf.slice(0, lastZero)
}

function buildSwapOut(secretHash: Buffer, recipientPkh: Buffer, refundPkh: Buffer, expiration: number) {
  var script = bcScript.empty()
    .add(bcOpcode.OP_IF)
    .add(bcOpcode.OP_SIZE)
    .add(0x01)
    .add(32)
    .add(bcOpcode.OP_EQUALVERIFY)
    .add(bcOpcode.OP_SHA256)
    .add(secretHash)
    .add(bcOpcode.OP_EQUALVERIFY)
    .add(bcOpcode.OP_DUP)
    .add(bcOpcode.OP_HASH160)
    .add(recipientPkh)
    .add(bcOpcode.OP_ELSE)
    .add(encodeExpiration(expiration))
    .add(bcOpcode.OP_CHECKLOCKTIMEVERIFY)
    .add(bcOpcode.OP_DROP)
    .add(bcOpcode.OP_DUP)
    .add(bcOpcode.OP_HASH160)
    .add(refundPkh)
    .add(bcOpcode.OP_ENDIF)
    .add(bcOpcode.OP_EQUALVERIFY)
    .add(bcOpcode.OP_CHECKSIG)

  return script;
};

export { SwapScriptHashInput, buildSwapOut, bitcoreCash };
