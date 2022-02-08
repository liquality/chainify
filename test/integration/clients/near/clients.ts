import * as Near from '@liquality/near';
import { Client } from '@liquality/client';
import { Network, WalletOptions } from '@liquality/types';

import { NearConfig } from './config';

function getNearClient(network: Network) {
    const config = NearConfig(network);
    const chainProvider = new Near.NearChainProvider(network);
    const walletProvider = new Near.NearWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    return new Client(chainProvider, walletProvider);
}

export const NearClient = getNearClient(Near.NearNetworks.near_testnet);
