import * as EVM from '@liquality/evm';
import { Client } from '@liquality/client';
import { Network, WalletOptions } from '@liquality/types';

import { EVMConfig } from './config';

function getEvmClient(network: Network) {
    const config = EVMConfig(network);
    const chainProvider = new EVM.EvmChainProvider(network);
    const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider(config.swapOptions, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const EthereumClient = getEvmClient(EVM.EvmNetworks.ganache);
