export const EVMConfig = {
    walletOptions: {
        mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
        derivationPath: `m/44'/60'/0'/0/`,
        index: '0',
    },

    walletExpectedResult: {
        address: '0x70B2d0adf991a69FC65eC510A05EC1f7392B6E05',
        address2: '0xe862a41cef3bbcc6d85bff8b9c36801a6bc4453e',
        privateKey: 'b2b630d7354d5ffa273b10153c3dade56bc8587d66331c2aaae447eb4daa2065',
        signedMessage:
            '926abeac6b5698f182d31d2b657f8c3352aa0f92337128fac1741960844c2aa25a7ba8c27112ec2e7c960505edbc9508816f03088d7947f754795b92ba8e8b2e1b',
    },

    recipientAddress: '0xe862a41cef3bbcc6d85bff8b9c36801a6bc4453e',
};

export interface IConfig {
    walletOptions: Record<string, any>;
    walletExpectedResult: {
        address: string;
        privateKey: string;
        signedMessage: string;
    };
    recipientAddress: string;
}
