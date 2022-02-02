import { shouldBehaveLikeEvmClient } from './clients/evm';
import { shouldBehaveLikeBitcoinClient } from './clients/bitcoin';
import { startLocalNetworks, stopLocalNetworks } from './environment';

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', async () => {
        shouldBehaveLikeEvmClient();
        shouldBehaveLikeBitcoinClient();
    });

    after(async () => {
        await stopLocalNetworks();
    });
});
