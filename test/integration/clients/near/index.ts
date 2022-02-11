import { Chains } from '../../common';

import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';
import { NearWalletProvider } from '@liquality/near';
import { WalletOptions } from '@liquality/types';
import { Client } from '@liquality/client';

export function shouldBehaveLikeNearClient() {
    before('Send funds to Near sender', async () => {
        const { client, config } = Chains.near;
        const tempClient = new Client(
            client.chain,
            new NearWalletProvider(
                {
                    ...(config.walletOptions as WalletOptions),
                    mnemonic: 'pet replace kitchen ladder jaguar bleak health horn high fall crush maze',
                },
                client.chain
            )
        );

        const nearBalance = (await tempClient.wallet.getBalance(config.assets))[0];
        if (nearBalance.gt(config.swapParams.value)) {
            await tempClient.wallet.sendTransaction({
                to: await client.wallet.getAddress(),
                value: nearBalance.minus(config.swapParams.value),
            });
        }
    });

    describe('Near Client', () => {
        shouldBehaveLikeChainProvider(Chains.near);
        shouldBehaveLikeWalletProvider(Chains.near);
        shouldBehaveLikeSwapProvider(Chains.near);
    });
}
