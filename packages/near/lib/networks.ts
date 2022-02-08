import { Network } from '@liquality/types';

export interface NearNetwork extends Network {
    helperUrl: string;
}

const near_mainnet: NearNetwork = {
    name: 'Near Mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://rpc.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    coinType: '397',
    isTestnet: false,
};

const near_testnet: NearNetwork = {
    name: 'Near Testnet',
    networkId: 'testnet',
    rpcUrl: 'https://rpc.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    coinType: '397',
    isTestnet: true,
};

const NearNetworks = {
    near_mainnet,
    near_testnet,
};

export { NearNetworks };
