import { EVMConfig } from './config';
import { deploy } from '../../deploy';
import { EthereumClient } from './clients';

import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';

export function shouldBehaveLikeEvmClient() {
    before(async () => {
        await deploy(EthereumClient);
    });

    describe('EVM Client', async () => {
        shouldBehaveLikeChainProvider(EthereumClient, EVMConfig);
        shouldBehaveLikeWalletProvider(EthereumClient, EVMConfig);
    });
}
