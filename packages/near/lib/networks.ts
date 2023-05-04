import { NearNetwork } from './types';

const near_mainnet: NearNetwork = {
    name: 'Near Mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://near-mainnet.infura.io/v3/37efa691ffec4c41a60aa4a69865d8f6',
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
