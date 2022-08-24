import { Client } from '@chainify/client';
import { TerraChainProvider, TerraWalletProvider } from '@chainify/terra';
import { AssetTypes } from '@chainify/types';
import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains } from '../../common';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';

export function shouldBehaveLikeTerraClient() {
    before('Send funds to Terra sender', async () => {
        const { client, config } = Chains.terra.hd;
        const tempClient = new Client(
            client.chain,
            new TerraWalletProvider(
                {
                    ...(config.walletOptions as any),
                    mnemonic:
                        'avoid void grid scare guard biology gaze system wine undo tomorrow evoke noble salon income juice stumble myth debate praise kind reflect ketchup fossil',
                },
                client.chain as TerraChainProvider
            )
        );

        const terraBalance = (await tempClient.wallet.getBalance(config.assets))[0];
        if (terraBalance.gt(config.swapParams.value)) {
            await tempClient.wallet.sendTransaction({
                to: await client.wallet.getAddress(),
                value: terraBalance.minus(config.swapParams.value),
                asset: config.assets.find((a) => a.type === AssetTypes.native),
                feeAsset: config.sendParams.feeAsset,
            });
        }
    });

    describe('Terra Client - HD Wallet', () => {
        const chain = Chains.terra.hd;
        shouldBehaveLikeChainProvider(chain);
        shouldBehaveLikeWalletProvider(chain);
        shouldBehaveLikeSwapProvider(chain);
    });
}
