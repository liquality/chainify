import { Coin } from '@terra-money/terra.js';

interface Log {
    msg_index: number;
    log:
        | string
        | {
              tax: string;
          };
    events?: Event[];
}

interface Event {
    type: string;
    attributes: {
        key: string;
        value: string;
    }[];
}

interface Value {
    fee: {
        amount: Coin[];
        gas: string;
    };
    msg: Message[];
    signatures: Signature[];
    memo: string;
    timeout_height?: string;
}

interface Message {
    type: string;
    value: { [key: string]: any };
}

interface Signature {
    pub_key: {
        type: string;
        value: string;
    };
    signature: string;
}

interface LcdTx {
    type: string;
    value: Value;
}

export interface LcdTransaction {
    height: string;
    txhash: string;
    codespace?: string;
    code?: number;
    raw_log: string;
    logs: Log[];
    gas_wanted: string;
    gas_used: string;
    tx: LcdTx;
    timestamp: string; // unix time (GMT)
}
