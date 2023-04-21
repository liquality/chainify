import { Network } from '@chainify/types';

const solana_mainnet: Network = {
    name: 'Solana Mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    coinType: '501',
    isTestnet: false,
};

const solana_testnet: Network = {
    name: 'Solana Testnet',
    networkId: 'testnet',
    rpcUrl: 'https://api.devnet.solana.com',
    coinType: '501',
    isTestnet: true,
};

const SolanaNetworks = {
    solana_mainnet,
    solana_testnet,
};

export { SolanaNetworks };
