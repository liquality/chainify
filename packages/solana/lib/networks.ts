import { Network } from '@liquality/types';

const solana_mainnet: Network = {
    name: 'Solana Mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://solana--mainnet.datahub.figment.io/apikey/d7d9844ccf72ad4fef9bc5caaa957a50',
    coinType: '501',
    isTestnet: false,
};

const solana_testnet: Network = {
    name: 'Solana Testnet',
    networkId: 'testnet',
    rpcUrl: 'https://solana--devnet.datahub.figment.io/apikey/d7d9844ccf72ad4fef9bc5caaa957a50',
    coinType: '501',
    isTestnet: true,
};

const SolanaNetworks = {
    solana_mainnet,
    solana_testnet,
};

export { SolanaNetworks };
