import { Client } from '@liquality/client';
import * as Terra from '@liquality/terra';

function getTerraClient(network: Terra.TerraTypes.TerraNetwork) {
    const chainProvider = new Terra.TerraChainProvider(network);
    return new Client(chainProvider);
}

export const TerraClient = getTerraClient(Terra.TerraNetworks.terra_testnet);
