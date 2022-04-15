import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { config as dotenvConfig } from 'dotenv';
import 'hardhat-gas-reporter';
import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';
import { resolve } from 'path';
import 'solidity-coverage';
import './tasks/accounts';
import './tasks/deploy';

dotenvConfig({ path: resolve(__dirname, './.env') });

const chainIds = {
    goerli: 5,
    hardhat: 31337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
    rskTestnet: 31,
    rsk: 30,
    polygon: 137,
    avalanche: 43114,
    arbitrumOne: 42161,
    bsc: 56,
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
    etherscan: {
        apiKey: {
            ropsten: process.env.ETHERSCAN_API_KEY,
            arbitrumOne: process.env.ARBISCAN_API_KEY,
            avalanche: process.env.SNOWTRACE_API_KEY,
            bsc: process.env.BSCSCAN_API_KEY,
            mainnet: process.env.ETHERSCAN_API_KEY,
            optimisticEthereum: process.env.OPTIMISM_API_KEY,
            polygon: process.env.POLYGONSCAN_API_KEY,
            polygonMumbai: process.env.POLYGONSCAN_API_KEY,
            rinkeby: process.env.ETHERSCAN_API_KEY,
        },
    },
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
        rskTestnet: getChainConfig('rskTestnet'),
        rsk: getChainConfig('rsk'),
        polygon: getChainConfig('polygon'),
        avalanche: getChainConfig('avalanche'),
        mainnet: getChainConfig('mainnet'),
        arbitrumOne: getChainConfig('arbitrumOne'),
        bsc: getChainConfig('bsc'),
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
