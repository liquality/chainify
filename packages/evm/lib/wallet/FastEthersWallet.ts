import { Wallet } from '@ethersproject/wallet';
import { mnemonicToSeed } from 'bip39';
import hdkey from 'hdkey';

export const defaultPath = "m/44'/60'/0'/0/0";

export class FastEthersWallet extends Wallet {
    static async fromMnemonicAsync(mnemonic: string, path?: string): Promise<Wallet> {
        if (!path) {
            path = defaultPath;
        }
        const hdKey = await FastEthersWallet.hdKey(mnemonic, path);
        return new Wallet(hdKey.privateKey);
    }

    private static async node(mnemonic: string) {
        const seed = await mnemonicToSeed(mnemonic);
        return hdkey.fromMasterSeed(seed);
    }

    private static async hdKey(mnemonic: string, path: string) {
        const node = await this.node(mnemonic);
        return node.derive(path);
    }
}
