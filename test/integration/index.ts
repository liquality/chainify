import { Logger, LogLevel } from '@chainify/logger';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { shouldBehaveLikeBitcoinClient } from './clients/bitcoin';
import { shouldBehaveLikeEvmClient } from './clients/evm';
import { shouldBehaveLikeNearClient } from './clients/near';
import { shouldBehaveLikeSolanaClient } from './clients/solana';
import { shouldBehaveLikeTerraClient } from './clients/terra';
import { describeExternal } from './common';
import { startLocalNetworks, stopLocalNetworks } from './environment';

chai.use(chaiAsPromised);

// turn off the logger for the tests
Logger.setLogLevel(LogLevel.OFF);

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', () => {
        shouldBehaveLikeEvmClient();
        shouldBehaveLikeBitcoinClient();
    });

    describeExternal('Manual Clients', () => {
        shouldBehaveLikeNearClient();
        shouldBehaveLikeTerraClient();
        shouldBehaveLikeSolanaClient();
    });

    after(async () => {
        await stopLocalNetworks();
    });
});
