import { providers } from 'ethers';
import * as EVM from '@liquality/evm';
import { Client } from '@liquality/client';
import { Network, WalletOptions } from '@liquality/types';

import { EVMConfig } from './config';
import { EIP1559MockFeeProvider } from './mock/EIP1559MockFeeProvider';

function getEvmClient(network: Network) {
    const config = EVMConfig(network);
    const provider = new providers.StaticJsonRpcProvider(network.rpcUrl); //
    const feeProvider = new EIP1559MockFeeProvider(provider);
    const chainProvider = new EVM.EvmChainProvider(network, provider, feeProvider);
    const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider(config.swapOptions, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const EthereumClient = getEvmClient(EVM.EvmNetworks.ganache);
