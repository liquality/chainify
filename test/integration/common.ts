import { BitcoinNetworks } from '@liquality/bitcoin';
import { Client } from '@liquality/client';
import { EvmNetworks } from '@liquality/evm';
import { NearNetworks } from '@liquality/near';
import { SolanaNetworks } from '@liquality/solana';
import { TerraNetworks } from '@liquality/terra';
import { Address, AddressType, BigNumber, FeeType, SwapParams, Transaction } from '@liquality/types';
import { retry, sha256, sleep } from '@liquality/utils';
import { expect } from 'chai';
import {
    BitcoinHDWalletClient,
    BitcoinLedgerClient,
    BitcoinNodeWalletClient,
    EVMClient,
    EVMLedgerClient,
    NearClient,
    SolanaClient,
    TerraClient,
} from './clients';
import {
    BtcHdWalletConfig,
    BtcLedgerConfig,
    BtcNodeConfig,
    EVMConfig,
    EVMLedgerConfig,
    NearConfig,
    SolanaConfig,
    TerraConfig,
} from './config';
import { Chain, ChainType, IConfig, WalletType } from './types';

export const describeExternal = process.env.RUN_EXTERNAL ? describe.only : describe.skip;

export const Chains: { [key in ChainType]: Partial<{ [key in WalletType]: Chain }> } = {
    [ChainType.btc]: {
        node: {
            id: 'BTC',
            name: 'btc-node-wallet',
            config: BtcNodeConfig(BitcoinNetworks.bitcoin_regtest),
            client: BitcoinNodeWalletClient,
        },

        hd: {
            id: 'BTC',
            name: 'btc-hd-wallet',
            config: BtcHdWalletConfig(BitcoinNetworks.bitcoin_regtest),
            client: BitcoinHDWalletClient,
        },

        ledger: {
            id: 'BTC',
            name: 'btc-ledger-wallet',
            config: BtcLedgerConfig(BitcoinNetworks.bitcoin_regtest),
            client: BitcoinLedgerClient,
        },
    },

    [ChainType.evm]: {
        hd: {
            id: 'EVM',
            name: 'evm',
            config: EVMConfig(EvmNetworks.ganache),
            client: EVMClient,
        },

        ledger: {
            id: 'EVM',
            name: 'evm-ledger',
            config: EVMLedgerConfig(EvmNetworks.ganache),
            client: EVMLedgerClient,
        },
    },

    [ChainType.near]: {
        hd: {
            id: 'NEAR',
            name: 'near',
            config: NearConfig(NearNetworks.near_testnet),
            client: NearClient,
        },
    },

    [ChainType.terra]: {
        hd: {
            id: 'TERRA',
            name: 'terra',
            config: TerraConfig(TerraNetworks.terra_testnet),
            client: TerraClient,
        },
    },

    [ChainType.solana]: {
        hd: {
            id: 'SOLANA',
            name: 'solana',
            config: SolanaConfig(SolanaNetworks.solana_testnet),
            client: SolanaClient,
        },
    },
};

export async function getSwapParams(client: Client, config: IConfig, expiryInSeconds = 200, native = true) {
    const asset = config.assets.find((a) => a.isNative === native);
    const refundAddress = await client.wallet.getAddress();
    const block = await client.chain.getBlockByNumber();
    const secret = await client.swap.generateSecret('secret');
    const secretHash = sha256(secret);
    await sleep(1000);

    const expiry = config.swapParams.expiry || expiryInSeconds;
    const expiration = block.timestamp ? Math.round(block.timestamp + expiry) : Math.round(Date.now() / 1000 + Math.random() * expiry);

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

export async function increaseTime(chain: Chain, timestamp: number) {
    switch (chain.id) {
        case 'EVM': {
            await chain.client.chain.sendRpcRequest('evm_increaseTime', [1000]);
            await chain.client.chain.sendRpcRequest('evm_mine', []);
            break;
        }

        case 'NEAR':
        case 'TERRA':
        case 'SOLANA': {
            const currentTime = Math.round(Date.now() / 1000);
            const sleepAmount = timestamp - currentTime;
            await sleep(sleepAmount > 0 ? sleepAmount : 1000);
            break;
        }

        case 'BTC': {
            const maxNumberOfBlocks = 100;
            for (let i = 0; i < maxNumberOfBlocks; i++) {
                const blockHeight = await chain.client.chain.getBlockHeight();
                const block = await chain.client.chain.getBlockByNumber(blockHeight);
                if (block.timestamp > timestamp) {
                    break;
                }
                await mineBlock(chain);
                await sleep(1000);
            }
        }
    }
}

export async function fundWallet(chain: Chain) {
    if (chain.funded) {
        return;
    }

    const address = await chain.client.wallet.getUnusedAddress();
    await fundAddress(chain, address.address);
    chain.funded = true;
}

export async function mineBlock(chain: Chain, numberOfBlocks = 1) {
    const { client } = chain;
    switch (chain.id) {
        case 'EVM': {
            return client.chain.sendRpcRequest('evm_mine', []);
        }
        case 'NEAR':
        case 'TERRA':
        case 'SOLANA': {
            await sleep(10000);
            break;
        }

        case 'BTC': {
            const miningAddressLabel = 'miningAddress';
            let address;
            try {
                // Avoid creating 100s of addresses for mining
                const labelAddresses = await client.chain.sendRpcRequest('getaddressesbylabel', [miningAddressLabel]);
                address = Object.keys(labelAddresses)[0];
            } catch (e) {
                // Label does not exist
                address = await client.chain.sendRpcRequest('getnewaddress', [miningAddressLabel]);
            }
            return client.chain.sendRpcRequest('generatetoaddress', [numberOfBlocks, address]);
        }
    }
}

export async function refundAndVerify(chain: Chain, swapParams: SwapParams, initiationTxId: string, fee?: FeeType): Promise<Transaction> {
    const refundTx = await chain.client.swap.refundSwap(swapParams, initiationTxId, fee);
    await mineBlock(chain);
    const currentBlock = await chain.client.chain.getBlockHeight();
    const foundRefundTx = await findRefundSwapTransaction(chain, swapParams, initiationTxId, Number(currentBlock.toString()));
    expect(foundRefundTx.hash).to.equal(refundTx.hash);
    return foundRefundTx;
}

export async function initiateAndVerify(chain: Chain, swapParams: SwapParams, fee?: FeeType): Promise<Transaction> {
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
    fee?: FeeType
): Promise<Transaction> {
    const claimTx = await chain.client.swap.claimSwap(swapParams, initiationTxId, secret, fee);
    await mineBlock(chain);
    const currentBlock = await chain.client.chain.getBlockHeight();
    const foundClaimTx = await findClaimSwapTransaction(chain, swapParams, initiationTxId, Number(currentBlock.toString()));
    expect(foundClaimTx.hash).to.equal(claimTx.hash);
    const foundSecret = await chain.client.swap.getSwapSecret(foundClaimTx.hash, initiationTxId);
    expect(secret).to.equal(foundSecret).to.equal(foundClaimTx.secret);
    expect(foundClaimTx.hash).to.equal(claimTx.hash);
    return foundClaimTx;
}

export async function fundAddress(chain: Chain, address: AddressType, value?: BigNumber) {
    let tx: Transaction;
    switch (chain.id) {
        case 'BTC': {
            const { client } = Chains.btc.node;
            tx = await client.wallet.sendTransaction({
                to: address,
                value: value || new BigNumber(10 * 1e8),
            });

            break;
        }

        case 'EVM': {
            await chain.client.wallet.sendTransaction({
                to: address,
                value: value || new BigNumber(1e18),
            });
            break;
        }
    }

    await mineBlock(chain);
    await sleep(1000);
    return tx;
}

export async function getNewAddress(chain: Chain, _refund = false): Promise<Address> {
    switch (chain.id) {
        default: {
            return chain.client.wallet.getUnusedAddress();
        }
    }
}

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
