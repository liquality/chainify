import { Client } from '../../packages/client';
import { Network } from '../../packages/types';

import * as EVM from '../../packages/evm';
import { EVMConfig } from './config';

function getEvmClient(network: Network) {
    const chainProvider = new EVM.EvmChainProvider(network);
    const walletProvider = new EVM.EvmWalletProvider(EVMConfig.walletOptions, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider({ contractAddress: '0x0000000000000000000000000000000000000000' }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const EthereumClient = getEvmClient({
    name: 'Ethereum',
    coinType: '60',
    isTestnet: true,
    chainId: 1,
    rpcUrl: 'http://localhost:8545',
});
