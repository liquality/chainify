import { Client } from '@chainify/client';
import * as Near from '@chainify/near';
import { NearConfig } from './config';

function getNearClient(network: Near.NearTypes.NearNetwork) {
    const config = NearConfig(network);
    const chainProvider = new Near.NearChainProvider(network);
    const walletProvider = new Near.NearWalletProvider(config.walletOptions as Near.NearTypes.NearWalletOptions, chainProvider);
    const swapProvider = new Near.NearSwapProvider(network.helperUrl, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const NearClient = getNearClient(Near.NearNetworks.near_testnet);
