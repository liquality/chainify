import { Chains } from '../../common';

import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';

export function shouldBehaveLikeNearClient() {
    describe('Near Client', () => {
        shouldBehaveLikeChainProvider(Chains.near);
        shouldBehaveLikeWalletProvider(Chains.near);
        shouldBehaveLikeSwapProvider(Chains.near);
    });
}
