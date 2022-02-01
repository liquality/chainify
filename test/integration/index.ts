import { shouldBehaveLikeChainProvider } from './chain/chain.test';
import { EthereumClient } from './common';
import { EVMConfig } from './config';
import { closeGanache, startGanache } from './environment/ganache';
import { shouldBehaveLikeWalletProvider } from './wallet/wallet.test';

describe('Integration tests', function () {
    before(async () => {
        await startGanache();
    });

    describe('Client', async () => {
        shouldBehaveLikeWalletProvider(EthereumClient, EVMConfig);
        shouldBehaveLikeChainProvider(EthereumClient);
    });

    after(async () => {
        await closeGanache();
    });
});
