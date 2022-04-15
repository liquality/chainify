import { Client } from '@liquality/client';
import { SolanaChainProvider, SolanaWalletProvider } from '@liquality/solana';
import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains } from '../../common';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';

export function shouldBehaveLikeSolanaClient() {
    before('Send funds to Solana sender', async () => {
        const { client, config } = Chains.solana.hd;
        const tempClient = new Client(
            client.chain,
            new SolanaWalletProvider(
                {
                    ...(config.walletOptions as any),
                    mnemonic:
                        'avoid void grid scare guard biology gaze system wine undo tomorrow evoke noble salon income juice stumble myth debate praise kind reflect ketchup fossil',
                },
                client.chain as SolanaChainProvider
            )
        );

        const solanaBalance = (await tempClient.wallet.getBalance(config.assets))[0];
        if (solanaBalance.gt(config.swapParams.value)) {
            await tempClient.wallet.sendTransaction({
                to: await client.wallet.getAddress(),
                value: solanaBalance.minus(config.swapParams.value),
            });
        }
    });

    describe('Solana Client - HD Wallet', () => {
        const chain = Chains.solana.hd;
        shouldBehaveLikeChainProvider(chain);
        shouldBehaveLikeWalletProvider(chain);
        shouldBehaveLikeWalletProvider(chain, false);
        // shouldBehaveLikeSwapProvider(chain);
    });
}
