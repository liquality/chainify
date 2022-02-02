import { EVMConfig } from './config';
import { EthereumClient } from './clients';

import { deploy } from '../../deploy';
import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldUpdateTransactionFee } from './updateTransactionFee.behavior';

export function shouldBehaveLikeEvmClient() {
    before(async () => {
        await deploy(EthereumClient);
    });

    describe('EVM Client', () => {
        shouldBehaveLikeChainProvider(EthereumClient, EVMConfig);
        shouldBehaveLikeWalletProvider(EthereumClient, EVMConfig);
        shouldUpdateTransactionFee(EthereumClient, EVMConfig);
    });
}
