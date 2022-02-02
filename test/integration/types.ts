import { Asset } from '@liquality/types';

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
    assets: Asset[];
    recipientAddress: string;
    multicallAddress?: string;
}
