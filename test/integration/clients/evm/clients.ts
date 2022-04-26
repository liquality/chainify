import LedgerHwTransportNode from '@ledgerhq/hw-transport-node-hid';
import { Client } from '@liquality/client';
import * as EVM from '@liquality/evm';
import { EvmLedgerProvider } from '@liquality/evm-ledger';
import { Network, WalletOptions } from '@liquality/types';
import { providers } from 'ethers';
import { EVMConfig } from './config';
import { EIP1559MockFeeProvider } from './mock/EIP1559MockFeeProvider';

function getEvmClient(network: Network) {
    const config = EVMConfig(network);
    const provider = new providers.StaticJsonRpcProvider(network.rpcUrl);
    const feeProvider = new EIP1559MockFeeProvider(provider);
    const chainProvider = new EVM.EvmChainProvider(network, provider, feeProvider);
    // we don't have multicall on the common address on Ganache
    void chainProvider.multicall.setMulticallAddress('0x08579f8763415cfCEa1B0F0dD583b1A0DEbfBe2b');
    const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider(config.swapOptions, walletProvider);
    const client = new Client<EVM.EvmChainProvider, EVM.EvmWalletProvider, EVM.EvmSwapProvider>().connect(swapProvider);
    return client;
}

function getEvmLedgerClient(network: Network) {
    const config = EVMConfig(network);
    const provider = new providers.StaticJsonRpcProvider(network.rpcUrl);
    const feeProvider = new EIP1559MockFeeProvider(provider);
    const chainProvider = new EVM.EvmChainProvider(network, provider, feeProvider);
    // we don't have multicall on the common address on Ganache
    void chainProvider.multicall.setMulticallAddress('0x08579f8763415cfCEa1B0F0dD583b1A0DEbfBe2b');
    const walletProvider = new EvmLedgerProvider({ ...config.walletOptions, Transport: LedgerHwTransportNode } as any, chainProvider);
    const swapProvider = new EVM.EvmSwapProvider(config.swapOptions, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const EVMClient = getEvmClient(EVM.EvmNetworks.ganache);
export const EVMLedgerClient = getEvmLedgerClient(EVM.EvmNetworks.ganache);
