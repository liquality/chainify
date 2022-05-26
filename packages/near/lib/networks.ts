import { NearNetwork } from './types';

const near_mainnet: NearNetwork = {
    name: 'Near Mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://rpc.mainnet.near.org',
    helperUrl: 'https://near-mainnet-api.liq-chainhub.net',
    coinType: '397',
    isTestnet: false,
};

const near_testnet: NearNetwork = {
    name: 'Near Testnet',
    networkId: 'testnet',
    rpcUrl: 'https://rpc.testnet.near.org',
    helperUrl: 'https://near-testnet-api.liq-chainhub.net',
    coinType: '397',
    isTestnet: true,
};

const NearNetworks = {
    near_mainnet,
    near_testnet,
};

export { NearNetworks };
