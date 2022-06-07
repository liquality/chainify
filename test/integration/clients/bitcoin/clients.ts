import * as BTC from '@chainify/bitcoin';
import { BitcoinLedgerProvider } from '@chainify/bitcoin-ledger';
import { Client } from '@chainify/client';
import { NodeTransportCreator } from '../../environment/NodeTransportCreator';
import { BtcHdWalletConfig, BtcLedgerConfig, BtcNodeConfig } from './config';

function getBtcClientWithNodeWallet(network: BTC.BitcoinTypes.BitcoinNetwork) {
    const config = BtcNodeConfig(network);
    const chainProvider = new BTC.BitcoinJsonRpcProvider(config.chainOptions as any);
    const walletProvider = new BTC.BitcoinNodeWalletProvider(null, chainProvider);
    const swapProvider = new BTC.BitcoinSwapRpcProvider({ network }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

function getBtcClientWithHDWallet(network: BTC.BitcoinTypes.BitcoinNetwork) {
    const config = BtcHdWalletConfig(network);
    const chainProvider = new BTC.BitcoinJsonRpcProvider(config.chainOptions as any);
    const walletProvider = new BTC.BitcoinHDWalletProvider(config.walletOptions as any, chainProvider);
    const swapProvider = new BTC.BitcoinSwapRpcProvider({ network }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

function getBtcLedgerClient(network: BTC.BitcoinTypes.BitcoinNetwork) {
    const config = BtcLedgerConfig(network);
    const chainProvider = new BTC.BitcoinJsonRpcProvider(config.chainOptions as any);

    const walletProvider = new BitcoinLedgerProvider(
        { ...config.walletOptions, transportCreator: new NodeTransportCreator() } as any,
        chainProvider
    );
    const swapProvider = new BTC.BitcoinSwapRpcProvider({ network }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const BitcoinNodeWalletClient = getBtcClientWithNodeWallet(BTC.BitcoinNetworks.bitcoin_regtest);
export const BitcoinHDWalletClient = getBtcClientWithHDWallet(BTC.BitcoinNetworks.bitcoin_regtest);
export const BitcoinLedgerClient = getBtcLedgerClient(BTC.BitcoinNetworks.bitcoin_regtest);
