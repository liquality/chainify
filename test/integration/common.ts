import { EvmNetworks } from '@liquality/evm';
import { NearNetworks } from '@liquality/near';

import { sha256 } from '@liquality/utils';
import { Client } from '@liquality/client';
import { FeeData, SwapParams, Transaction } from '@liquality/types';
import { expect } from 'chai';
import { EthereumClient, NearClient } from './clients';
import { EVMConfig, NearConfig } from './config';
import { Chain, ChainType, IConfig } from './types';

export const Chains: { [key in ChainType]: Chain } = {
    [ChainType.evm]: {
        id: 'EVM',
        name: 'evm',
        config: EVMConfig(EvmNetworks.ganache),
        client: EthereumClient,
    },
    [ChainType.near]: {
        id: 'NEAR',
        name: 'near',
        config: NearConfig(NearNetworks.near_testnet),
        client: NearClient,
    },
};

export async function getSwapParams(client: Client, config: IConfig, expiryInSeconds = 200, native = true) {
    const asset = config.assets.find((a) => a.isNative === native);
    const refundAddress = await client.wallet.getAddress();
    const block = await client.chain.getBlockByNumber();
    const secret = await client.swap.generateSecret('secret');
    const secretHash = sha256(secret);
    await sleep(1);

    const expiration = block.timestamp
        ? block.timestamp + expiryInSeconds
        : Math.round(Date.now() / 1000) + Math.round(Math.random() * expiryInSeconds);

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
        case 'NEAR': {
            await sleep(10);
            break;
        }
    }
}

export async function sleep(seconds: number) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function refundAndVerify(chain: Chain, swapParams: SwapParams, initiationTxId: string, fee?: FeeData): Promise<Transaction> {
    const refundTx = await chain.client.swap.refundSwap(swapParams, initiationTxId, fee);
    await mineBlock(chain);
    const currentBlock = await chain.client.chain.getBlockHeight();
    const foundRefundTx = await findRefundSwapTransaction(chain, swapParams, initiationTxId, Number(currentBlock.toString()));
    expect(foundRefundTx.hash).to.equal(refundTx.hash);
    return foundRefundTx;
}

export async function initiateAndVerify(chain: Chain, swapParams: SwapParams, fee?: FeeData): Promise<Transaction> {
    const initTx = await chain.client.swap.initiateSwap(swapParams, fee);
    await mineBlock(chain);
    const currentBlock = await chain.client.chain.getBlockHeight();
    const foundInitiateTx = await findInitiateSwapTransaction(chain, swapParams, Number(currentBlock.toString()));
    await chain.client.swap.verifyInitiateSwapTransaction(swapParams, foundInitiateTx.hash);
    expect(initTx.hash).to.equal(foundInitiateTx.hash);
    return foundInitiateTx;
}

export async function claimAndVerify(
    chain: Chain,
    swapParams: SwapParams,
    initiationTxId: string,
    secret: string,
    fee?: FeeData
): Promise<Transaction> {
    const claimTx = await chain.client.swap.claimSwap(swapParams, initiationTxId, secret, fee);
    await mineBlock(chain);
    const currentBlock = await chain.client.chain.getBlockHeight();
    const foundClaimTx = await findClaimSwapTransaction(chain, swapParams, initiationTxId, Number(currentBlock.toString()));
    expect(foundClaimTx.hash).to.equal(claimTx.hash);
    const foundSecret = await chain.client.swap.getSwapSecret(foundClaimTx.hash);
    expect(secret).to.equal(foundSecret);
    expect(foundClaimTx.hash).to.equal(claimTx.hash);
    return foundClaimTx;
}

export const retry = async <T>(method: () => Promise<T>, startWaitTime = 0.5, waitBackoff = 2, retryNumber = 5) => {
    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        try {
            const result = await method();
            if (result) {
                return result;
            }
            await sleep(waitTime);
            waitTime *= waitBackoff;
        } catch (err) {
            await sleep(waitTime);
        }
    }
    return null;
};

async function findRefundSwapTransaction(
    chain: Chain,
    swapParams: SwapParams,
    initiationTx: string,
    blockNumber?: number
): Promise<Transaction> {
    return await retry(async () => await chain.client.swap.findRefundSwapTransaction(swapParams, initiationTx, blockNumber));
}

async function findClaimSwapTransaction(
    chain: Chain,
    swapParams: SwapParams,
    initiationTx: string,
    blockNumber?: number
): Promise<Transaction> {
    return await retry(async () => await chain.client.swap.findClaimSwapTransaction(swapParams, initiationTx, blockNumber));
}

async function findInitiateSwapTransaction(chain: Chain, swapParams: SwapParams, blockNumber?: number): Promise<Transaction> {
    return await retry(async () => await chain.client.swap.findInitiateSwapTransaction(swapParams, blockNumber));
}
