import { assign } from 'lodash';
import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains, fundAddress } from '../../common';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldBehaveLikeBitcoinTransaction } from './behaviors/transactions.behavior';
import { shouldBehaveLikeBitcoinWallet } from './behaviors/wallet.behavior';
import { importBitcoinAddresses } from './utils';

export function shouldBehaveLikeBitcoinClient() {
    describe('Bitcoin Client - HD Wallet', () => {
        before(async () => {
            const { config } = Chains.btc.hd;
            await importBitcoinAddresses(Chains.btc.hd);
            await fundAddress(Chains.btc.node, config.walletExpectedResult.address);
        });
        shouldBehaveLikeChainProvider(Chains.btc.hd);
        shouldBehaveLikeWalletProvider(Chains.btc.hd);
        shouldBehaveLikeBitcoinWallet(Chains.btc.hd);
        shouldBehaveLikeBitcoinTransaction(Chains.btc.hd);
    });

    describe('Bitcoin Client - Node Wallet', () => {
        before(async () => {
            const { client, config } = Chains.btc.node;
            const address = await client.wallet.getAddress();
            const recipientAddress = await client.wallet.getUnusedAddress();
            const privateKey = await client.chain.sendRpcRequest('dumpprivkey', [address.toString()]);

            Chains.btc.node.config = assign(Chains.btc.node.config, {
                recipientAddress: recipientAddress.toString(),
                walletExpectedResult: { ...config.walletExpectedResult, privateKey },
            });
        });
        shouldBehaveLikeChainProvider(Chains.btc.node);
        shouldBehaveLikeWalletProvider(Chains.btc.node);
        shouldBehaveLikeBitcoinTransaction(Chains.btc.node);
    });
}
