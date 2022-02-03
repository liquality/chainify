import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import './tasks/accounts';
import './tasks/deploy';

import { resolve } from 'path';

import { config as dotenvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';

dotenvConfig({ path: resolve(__dirname, './.env') });

const chainIds = {
    goerli: 5,
    hardhat: 31337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
};

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC || 'here is where your twelve words mnemonic should be put my friend';
if (!process.env.MNEMONIC) {
    console.warn('Please set your MNEMONIC in a .env file. Using a default(fake) one');
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY || 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
if (!process.env.INFURA_API_KEY) {
    console.warn('Please set your INFURA_API_KEY in a .env file. Using a default(fake) one');
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
    const url: string = 'https://' + network + '.infura.io/v3/' + infuraApiKey;
    return {
        accounts: {
            count: 10,
            mnemonic,
            path: "m/44'/60'/0'/0",
        },
        chainId: chainIds[network],
        url,
    };
}

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            accounts: {
                mnemonic,
            },
            chainId: chainIds.hardhat,
        },
        goerli: getChainConfig('goerli'),
        kovan: getChainConfig('kovan'),
        rinkeby: getChainConfig('rinkeby'),
        ropsten: getChainConfig('ropsten'),
    },
    paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test',
    },
    solidity: {
        version: '0.8.11',
        settings: {
            metadata: {
                // Not including the metadata hash
                // https://github.com/paulrberg/solidity-template/issues/31
                bytecodeHash: 'none',
            },
            // Disable the optimizer when debugging
            // https://hardhat.org/hardhat-network/#solidity-optimizer-support
            optimizer: {
                enabled: true,
                runs: 800,
            },
        },
    },
    typechain: {
        outDir: 'src/types',
        target: 'ethers-v5',
    },
};

export default config;
