import { Client } from '@liquality/client';
import { Asset, BigNumber, Network } from '@liquality/types';

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
        value: BigNumber;
    };
    sendParams: {
        value: BigNumber;
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
