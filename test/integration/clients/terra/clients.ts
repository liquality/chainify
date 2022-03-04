import { Client } from '@liquality/client';
import * as Terra from '@liquality/terra';
import { TerraConfig } from './config';

function getTerraClient(network: Terra.TerraTypes.TerraNetwork) {
    const config = TerraConfig(network);
    const chainProvider = new Terra.TerraChainProvider(network);
    const walletProvider = new Terra.TerraWalletProvider(chainProvider, config.walletOptions as any);
    return new Client(chainProvider, walletProvider);
}

export const TerraClient = getTerraClient(Terra.TerraNetworks.terra_testnet);