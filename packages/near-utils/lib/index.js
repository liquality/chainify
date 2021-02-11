import { version } from "../package.json";

function toBase64(str, encoding = "hex") {
  return Buffer.from(str, encoding).toString("base64");
}

function fromBase64(str, encoding) {
  if (!str) {
    return {};
  }

  const decoded = Buffer.from(str, "base64").toString(encoding);

  try {
    return JSON.parse(decoded);
  } catch (e) {
    return decoded;
  }
}

function normalizeTransactionObject(tx, currentHeight) {
  const tx = { ...r.transaction, ...r.transaction_outcome };
  const normalizedTx = { swap: {}, raw: {} };
  if (tx) {
    normalizedTx.value = 0;
    normalizedTx.hash = `${tx.hash}_${tx.signer_id}`;
    normalizedTx.blockHash = tx.block_hash;
    normalizedTx.sender = tx.signer_id;
    normalizedTx.receiver = tx.receiver_id;
    normalizedTx.rawHash = tx.hash;

    if (tx.actions) {
      tx.actions.forEach((a) => {
        if (a.Transfer) {
          normalizedTx.value = a.Transfer.deposit;
        }

        if (a.DeployContract) {
          normalizedTx.code = a.DeployContract.code;
        }

        if (a.FunctionCall) {
          normalizedTx.swap.method = a.FunctionCall.method_name;

          switch (normalizedTx.swap.method) {
            case "init": {
              const args = fromBase64(a.FunctionCall.args);
              normalizedTx.swap.secretHash = fromBase64(args.secretHash, "hex");
              normalizedTx.swap.expiration = args.expiration;
              normalizedTx.swap.recipient = args.buyer;
              break;
            }

            case "claim": {
              const args = fromBase64(a.FunctionCall.args);
              normalizedTx.swap.secret = fromBase64(args.secret, "hex");
              break;
            }

            case "refund": {
              break;
            }

            default: {
              const args = fromBase64(a.FunctionCall.args);
              normalizedTx.raw = { ...args };
              break;
            }
          }
        }
      });
    }
  }
  return normalizedTx;
}

export { toBase64, fromBase64, normalizeTransactionObject, version };
