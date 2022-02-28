import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains } from '../../common';
import { deploy } from '../../deploy';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldUpdateTransactionFee } from './updateTransactionFee.behavior';

export function shouldBehaveLikeEvmClient() {
    before(async () => {
        await deploy(Chains.evm.hd.client);
    });

    describe('EVM Client - HD Wallet', () => {
        const chain = Chains.evm.hd;
        shouldBehaveLikeChainProvider(chain);
        shouldBehaveLikeWalletProvider(chain);
        shouldUpdateTransactionFee(chain);
        shouldBehaveLikeSwapProvider(chain);
    });
}
