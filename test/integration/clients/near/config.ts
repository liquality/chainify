import * as Near from '@chainify/near';
import { BigNumber, ChainId } from '@chainify/types';
import { IConfig } from '../../types';

export const NearConfig = (network: Near.NearTypes.NearNetwork): IConfig => {
    return {
        network,

        walletOptions: {
            mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
            derivationPath: `m/44'/${network.coinType}'/0'`,
            helperUrl: network.helperUrl,
        },

        walletExpectedResult: {
            address: '9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472',
            numberOfUsedAddresses: 1,
            unusedAddress: '9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472',
            privateKey: 'ed25519:4wRb35gLftuVgYCpNSLAF1SHUQuPFWEsbvh87WX2EDxHWV73vDf4J5sCsEPckeGBHSAf3vbvAyU4CpjidyTNFCcy',
            signedMessage:
                'b500437515ea4e3c6ba73c6fb765476d1ae3c8cce58c58ab5f60a0bce7af31c40f06287e448738c8a237450dae9adff04037b7a02b3ada39a6a74f703af5f109',
        },

        swapOptions: {
            contractAddress: '0x91441284dfAc14425c9Bf7b3f159CE480d0dd018',
        },

        swapParams: {
            value: new BigNumber(5000000000000000000000000),
        },

        sendParams: {
            value: new BigNumber(1),
        },

        recipientAddress: '797b73fdaae5f9c4b343a7f8a7334fb56d04dad9a32b5a5e586c503701d537b6',

        assets: [
            {
                name: 'Near',
                code: 'Near',
                chain: ChainId.Near,
                isNative: true,
                type: 'native',
                decimals: 24,
            },
        ],
    };
};
