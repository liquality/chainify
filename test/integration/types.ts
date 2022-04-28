import { Client } from '@chainify/client';
import { Asset, BigNumber, Network } from '@chainify/types';

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
        expiry?: number;
    };
    sendParams: {
        value?: BigNumber;
        feeAsset?: Asset;
    };
    assets: Asset[];
    recipientAddress?: string;
    multicallAddress?: string;
}

export enum ChainType {
    btc = 'btc',
    evm = 'evm',
    near = 'near',
    terra = 'terra',
    solana = 'solana',
}

export enum WalletType {
    hd = 'hd',
    node = 'node',
    ledger = 'ledger',
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
