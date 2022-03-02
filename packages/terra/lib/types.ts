import { Network, TransactionRequest } from '@liquality/types';
import { Msg } from '@terra-money/terra.js';

export interface TerraNetwork extends Network {
    codeId: number;
    helperUrl: string;
}

export interface TerraTxRequest extends TransactionRequest {
    msgs?: Msg[];
    memo?: string;
}
