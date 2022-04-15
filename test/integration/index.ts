import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { shouldBehaveLikeSolanaClient } from './clients/solana';
import { startLocalNetworks, stopLocalNetworks } from './environment';

chai.use(chaiAsPromised);

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', () => {
        // shouldBehaveLikeEvmClient();
        // shouldBehaveLikeBitcoinClient();
        // shouldBehaveLikeNearClient();
        // shouldBehaveLikeTerraClient();
        shouldBehaveLikeSolanaClient();
    });

    after(async () => {
        await stopLocalNetworks();
    });
});
