import { sha256 } from '@ethersproject/sha2';

import { Client } from '@liquality/client';
import { EthereumClient } from './clients';
import { EVMConfig } from './config';
import { Chain, ChainType, IConfig } from './types';

export const Chains: { [key in ChainType]: Chain } = {
    [ChainType.evm]: {
        id: 'EVM',
        name: 'evm',
        config: EVMConfig,
        client: EthereumClient,
    },
};

export async function getSwapParams(client: Client, config: IConfig, expiryInSeconds = 200, native = true) {
    const asset = config.assets.find((a) => a.isNative === native);
    const refundAddress = await client.wallet.getAddress();
    const secret = await client.swap.generateSecret('secret');
    const secretHash = sha256(secret);
    const expiration = Math.round(Date.now() / 1000) + Math.round(Math.random() * expiryInSeconds);

    return {
        swapParams: {
            asset,
            value: config.swapParams.value,
            recipientAddress: config.recipientAddress,
            refundAddress,
            secretHash,
            expiration,
        },
        secret,
    };
}

export async function increaseTime(chain: Chain, seconds: number) {
    switch (chain.id) {
        case 'EVM': {
            await chain.client.chain.sendRpcRequest('evm_increaseTime', [seconds]);
            // Workaround for https://github.com/trufflesuite/ganache/issues/1033
            await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            await chain.client.chain.sendRpcRequest('evm_mine', []);
            break;
        }
    }
}

export async function mineBlock(chain: Chain) {
    switch (chain.id) {
        case 'EVM': {
            await chain.client.chain.sendRpcRequest('evm_mine', []);
            break;
        }
    }
}
