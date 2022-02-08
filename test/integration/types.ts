import { Client } from '@liquality/client';
import { Asset, BigNumberish, Network } from '@liquality/types';

export interface IConfig {
    walletOptions: Record<string, any>;
    walletExpectedResult: {
        address: string;
        privateKey: string;
        signedMessage: string;
    };
    swapOptions: {
        contractAddress: string;
    };
    swapParams: {
        value: BigNumberish;
    };
    sendParams: {
        value: BigNumberish;
    };
    assets: Asset[];
    recipientAddress: string;
    multicallAddress?: string;
}

export enum ChainType {
    evm = 'evm',
    near = 'near',
}

export interface Chain {
    id: string;
    name: string;
    client: Client;
    config: IConfig;
    network?: Network;
    segwitFeeImplemented?: boolean;
    funded?: boolean;
}
