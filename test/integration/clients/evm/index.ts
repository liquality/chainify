import { Chains } from '../../common';

import { deploy } from '../../deploy';
import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldUpdateTransactionFee } from './updateTransactionFee.behavior';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';

export function shouldBehaveLikeEvmClient() {
    before(async () => {
        await deploy(Chains.evm.client);
    });

    describe('EVM Client', () => {
        shouldBehaveLikeChainProvider(Chains.evm);
        shouldBehaveLikeWalletProvider(Chains.evm);
        shouldUpdateTransactionFee(Chains.evm);
        shouldBehaveLikeSwapProvider(Chains.evm);
    });
}
