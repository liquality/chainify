import { Block, Transaction, TxStatus } from '@liquality/types';
import { BlockInfo, isTxError, MsgExecuteContract, MsgInstantiateContract, MsgSend, TxInfo } from '@terra-money/terra.js';
import { get } from 'lodash';
import { DateTime } from 'luxon';
import { TerraHTLC, TerraTxInfo } from './types';

interface ExecuteMsg {
    [key: string]: any;
}

export function parseBlockResponse(data: BlockInfo): Block {
    return {
        hash: data.block_id.hash,
        timestamp: parseTimestamp(data.block.header.time),
        number: Number(data.block.header.height),
        parentHash: data.block.last_commit.block_id.hash,
        _raw: data,
    };
}

const parseTimestamp = (fullDate: string): number => {
    return DateTime.fromISO(fullDate).toSeconds();
};

export function parseTxResponse(data: TxInfo, currentBlock: number): Transaction<TerraTxInfo> {
    const result: Transaction<TerraTxInfo> = {
        hash: data.txhash,
        value: 0,
        _raw: data,
        confirmations: currentBlock - data.height,
        status: isTxError(data) ? TxStatus.Failed : TxStatus.Success,
    };

    // handle fees
    if (data.tx.auth_info.fee.amount.toAmino()[0]) {
        const { amount, denom } = data.tx.auth_info.fee.amount.toAmino()[0];
        result.fee = Number(amount);
        result.feeAssetCode = denom;
    }

    const msg = data.tx.body?.messages?.[0];
    // Initiate swap
    if (msg instanceof MsgInstantiateContract) {
        const init = msg.init_msg as TerraHTLC;
        // TODO: is this the best way to get the contract address?
        result.to = get(data, 'logs[0].eventsByType.instantiate_contract.contract_address[0]', null);
        result.value = Number(msg.init_coins?.toAmino()?.[0].amount);

        // htlc init msg
        if (init.buyer && init.expiration && init.secret_hash && init.seller && init.value) {
            result._raw.htlc = { ...init, code_id: msg.code_id };
        }
        // any other deploy tx
        else {
            result._raw.initMsg = { ...init, code_id: msg.code_id };
        }
    }
    // Claim & Refund & Transfer ERC20
    else if (msg instanceof MsgExecuteContract) {
        result.from = msg.sender;
        result.to = msg.contract;

        // Claim
        const action = msg.execute_msg as ExecuteMsg;
        if (action.claim) {
            result.secret = action.claim.secret;
        }
        // ERC20
        else if (action.transfer) {
            result.to = action.transfer.recipient.toString();
            result.value = Number(action.transfer.amount);
            result.valueAsset = msg.contract;
        }
    }
    // Send LUNA & UST
    else if (msg instanceof MsgSend) {
        const { amount, denom } = msg.amount.toAmino()[0];
        result.from = msg.from_address;
        result.to = msg.to_address;
        result.value = Number(amount);
        result.valueAsset = denom;
    }

    return result;
}
