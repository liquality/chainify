import { Client } from '@liquality/client';
import * as Solana from '@liquality/solana';
import { Network } from '@liquality/types';

function getSolanaClient(network: Network) {
    // const config = SolanaConfig(network);
    const chainProvider = new Solana.SolanaChainProvider(network);
    // const walletProvider = new Solana.SolanaWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    // const swapProvider = new Solana.(network.helperUrl, walletProvider);
    return new Client(chainProvider);
}

export const SolanaClient = getSolanaClient(Solana.SolanaNetworks.solana_testnet);
