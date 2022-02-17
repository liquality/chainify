import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { shouldBehaveLikeBitcoinClient } from './clients/bitcoin';
import { shouldBehaveLikeEvmClient } from './clients/evm';
import { shouldBehaveLikeNearClient } from './clients/near';
import { startLocalNetworks, stopLocalNetworks } from './environment';

chai.use(chaiAsPromised);

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', () => {
        shouldBehaveLikeEvmClient();
        shouldBehaveLikeNearClient();
        shouldBehaveLikeBitcoinClient();
    });

    after(async () => {
        await stopLocalNetworks();
    });
});
