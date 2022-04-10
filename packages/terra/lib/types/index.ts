import { Network, TransactionRequest, WalletOptions } from '@liquality/types';
import { Msg, TxInfo } from '@terra-money/terra.js';
export * as FCD from './fcd';

export interface TerraWalletProviderOptions extends WalletOptions {
    gasAdjustment?: number;
}
export interface TerraNetwork extends Network {
    codeId: number;
    helperUrl: string;
}

export interface TerraTxRequest extends TransactionRequest {
    msgs?: Msg[];
    memo?: string;
    gasLimit?: number;
}

export interface TerraHTLC {
    buyer: string;
    seller: string;
    expiration: number;
    value: number;
    secret_hash: string;
    code_id: number;
}

export interface TerraTxInfo extends TxInfo {
    htlc?: TerraHTLC;
    initMsg?: any;
    method?: string;
}
