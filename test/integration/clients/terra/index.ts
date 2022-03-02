import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains } from '../../common';

export function shouldBehaveLikeTerraClient() {
    describe('Terra Client - HD Wallet', () => {
        const chain = Chains.terra.hd;
        shouldBehaveLikeChainProvider(chain);
        // shouldBehaveLikeWalletProvider(chain);
        // shouldBehaveLikeSwapProvider(chain);
    });
}
