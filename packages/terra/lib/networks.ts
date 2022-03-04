import { TerraNetwork } from './types';

const terra_mainnet: TerraNetwork = {
    name: 'mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://lcd.terra.dev',
    helperUrl: 'https://fcd.terra.dev/v1',
    coinType: '330',
    isTestnet: false,
    chainId: 'columbus-5',
    codeId: 1480,
};

const terra_testnet: TerraNetwork = {
    name: 'testnet',
    networkId: 'testnet',
    rpcUrl: 'https://bombay-lcd.terra.dev',
    helperUrl: 'https://bombay-fcd.terra.dev/v1',
    coinType: '330',
    isTestnet: true,
    chainId: 'bombay-12',
    codeId: 23733,
};

export const TerraNetworks = {
    terra_mainnet,
    terra_testnet,
};
