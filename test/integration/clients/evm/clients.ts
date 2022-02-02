import * as EVM from '@liquality/evm';
import { Client } from '@liquality/client';
import { Network, WalletOptions } from '@liquality/types';

import { EVMConfig } from './config';

function getEvmClient(network: Network) {
    const chainProvider = new EVM.EvmChainProvider(network);
    const walletProvider = new EVM.EvmWalletProvider(EVMConfig.walletOptions as WalletOptions, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider(EVMConfig.swapOptions, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const EthereumClient = getEvmClient({
    name: 'Ethereum',
    coinType: '60',
    isTestnet: true,
    chainId: 1337, // Ganache
    rpcUrl: 'http://localhost:8545',
});
