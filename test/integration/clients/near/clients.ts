import { Client } from '@liquality/client';
import * as Near from '@liquality/near';
import { WalletOptions } from '@liquality/types';
import { NearConfig } from './config';

function getNearClient(network: Near.NearTypes.NearNetwork) {
    const config = NearConfig(network);
    const chainProvider = new Near.NearChainProvider(network);
    const walletProvider = new Near.NearWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    const swapProvider = new Near.NearSwapProvider({ baseURL: network.helperUrl }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const NearClient = getNearClient(Near.NearNetworks.near_testnet);
