import { Client } from '@liquality/client';
import { Asset, BigNumber, Network } from '@liquality/types';

export interface IConfig {
    network: Network;
    walletOptions?: Record<string, any>;
    chainOptions?: Record<string, any>;
    walletExpectedResult?: {
        address?: string;
        privateKey?: string;
        privateKeyRegex?: RegExp;
        signedMessage?: string;
        unusedAddress?: string;
        numberOfUsedAddresses?: number;
    };
    swapOptions?: {
        contractAddress: string;
    };
    swapParams: {
        value?: BigNumber;
    };
    sendParams: {
        value?: BigNumber;
    };
    assets?: Asset[];
    recipientAddress?: string;
    multicallAddress?: string;
}

export enum ChainType {
    btc = 'btc',
    evm = 'evm',
    near = 'near',
    terra = 'terra',
}

export enum WalletType {
    hd = 'hd',
    node = 'node',
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
