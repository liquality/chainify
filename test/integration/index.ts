import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { shouldBehaveLikeEvmClient } from './clients/evm';
import { shouldBehaveLikeBitcoinClient } from './clients/bitcoin';
import { startLocalNetworks, stopLocalNetworks } from './environment';

chai.use(chaiAsPromised);

describe('Integration tests', function () {
    before(async () => {
        await startLocalNetworks();
    });

    describe('Clients', () => {
        shouldBehaveLikeEvmClient();
        shouldBehaveLikeBitcoinClient();
    });

    after(async () => {
        await stopLocalNetworks();
    });
});
