import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
    typechain: {
        outDir: 'lib/typechain',
        target: 'ethers-v5',
    },
};

export default config;
