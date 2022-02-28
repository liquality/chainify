import * as BTC from '@liquality/bitcoin';
import { Client } from '@liquality/client';
import { BtcHdWalletConfig, BtcNodeConfig } from './config';

function getBtcClientWithNodeWallet(network: BTC.BitcoinTypes.BitcoinNetwork) {
    const config = BtcNodeConfig(network);
    const chainProvider = new BTC.BitcoinJsonRpcProvider(config.chainOptions as any);
    const walletProvider = new BTC.BitcoinNodeWalletProvider(chainProvider);
    return new Client(chainProvider, walletProvider);
}

function getBtcClientWithHDWallet(network: BTC.BitcoinTypes.BitcoinNetwork) {
    const config = BtcHdWalletConfig(network);
    const chainProvider = new BTC.BitcoinJsonRpcProvider(config.chainOptions as any);
    const walletProvider = new BTC.BitcoinHDWalletProvider(config.walletOptions as any, chainProvider);
    return new Client(chainProvider, walletProvider);
}

export const BitcoinNodeWalletClient = getBtcClientWithNodeWallet(BTC.BitcoinNetworks.bitcoin_regtest);
export const BitcoinHDWalletClient = getBtcClientWithHDWallet(BTC.BitcoinNetworks.bitcoin_regtest);
