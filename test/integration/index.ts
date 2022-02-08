import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { shouldBehaveLikeEvmClient } from './clients/evm';
import { shouldBehaveLikeNearClient } from './clients/near';
import { shouldBehaveLikeBitcoinClient } from './clients/bitcoin';
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
