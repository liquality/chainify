import { bitcoreCash } from '../../bitcoin-cash-utils' //'@liquality/bitcoin-cash-utils'

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
  Transaction.Input.apply(this, arguments);
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
  if (!Script.buildScriptHashOut(this.redeemScript).equals(this.output.script)) {
    if (console) console.error("Output does not hash correctly");
    return;
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
  if (console) console.error("toObject unimplemented for P2SH swap inputs!");
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
    console.error("this.output instanceof Output false");
  }
  sigtype = sigtype || (bcSignature.SIGHASH_ALL | bcSignature.SIGHASH_FORKID);
  hashData = hashData || bcCrypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer());

  if (bcUtil.buffer.equals(hashData, this.recipientPkh) || bcUtil.buffer.equals(hashData, this.refundPkh)) {
    this.publicKey = privateKey.publicKey.toBuffer();
    return [new (bcTransaction as any).Signature({
      publicKey: privateKey.publicKey,
      prevTxId: this.prevTxId,
      outputIndex: this.outputIndex,
      inputIndex: index,
      signature: (bcTransaction as any).Sighash.sign(transaction, privateKey, sigtype, index, this.redeemScript, this.output.satoshisBN, undefined, signingMethod),
      sigtype: sigtype
    })];
  }
  return [];
};

SwapScriptHashInput.prototype.addSignature = function(transaction: any, signature: any, signingMethod: any) {
  if (this.isFullySigned()) {
    console.error("All needed signatures have already been added");
  }
  const publicKey = signature.publicKey.toBuffer()
  let hashData = bcCrypto.Hash.sha256ripemd160(publicKey);
  if (!bcUtil.buffer.equals(hashData, this.recipientPkh) && !bcUtil.buffer.equals(hashData, this.refundPkh)) {
    console.error("Signature has no matching public key");
  }
  if (!this.isValidSignature(transaction, signature, signingMethod)) {
    console.error("Invalid signature");
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

function buildP2SHSwapIn(secretHash: Buffer, recipientPkh: Buffer, refundPkh: Buffer, expiration: number, signatures: any[]) {
  if (!bcUtil.buffer.isBuffer(signatures[0]) || signatures.length != 1) {
    console.error("Signatures must be an Array(1) of Buffers");
  }
  var s = bcScript.empty()
    .add(signatures[0])
    // @ts-ignore
    .add(this.publicKey)

  // @ts-ignore
  if (this.secret) {
    // @ts-ignore
    s.add(this.secret)
      .add(bcOpcode.OP_TRUE)
  } else {
    s.add(bcOpcode.OP_FALSE)
  }
  s.add(
    buildSwapOut(secretHash, recipientPkh, refundPkh, expiration).toBuffer()
  );
  return s;
};

function buildSwapOut(secretHash: Buffer, recipientPkh: Buffer, refundPkh: Buffer, expiration: number) {
  var script = bcScript.empty()
    .add(bcOpcode.OP_IF)
    .add(bcOpcode.OP_SIZE)
    .add(32)
    .add(bcOpcode.OP_EQUALVERIFY)
    .add(bcOpcode.OP_SHA256)
    .add(secretHash)
    .add(bcOpcode.OP_EQUALVERIFY)
    .add(bcOpcode.OP_DUP)
    .add(bcOpcode.OP_HASH160)
    .add(recipientPkh)
    .add(bcOpcode.OP_ELSE)
    .add(expiration)
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

export { SwapScriptHashInput, buildSwapOut };
