import Chain from './Chain';
import Swap from './Swap';
import Wallet from './Wallet';

export default class Client<
    ChainType extends Chain<any> = Chain<any>,
    WalletType extends Wallet<any, any> = Wallet<any, any>,
    SwapType extends Swap<any, any> = Swap<any, any>
> {
    private _chain: ChainType;
    private _wallet: WalletType;
    private _swap: SwapType;

    constructor(chain?: ChainType, wallet?: WalletType, swap?: SwapType) {
        this._chain = chain;
        this._wallet = wallet;
        this._swap = swap;
    }

    connect(provider: ChainType | WalletType | SwapType) {
        if (provider instanceof Chain) {
            this.chain = provider;
            if (this.wallet) {
                this.wallet.setChainProvider(this.chain);
            }
        } else if (provider instanceof Wallet) {
            this.wallet = provider;
            this.connectChain();
            if (this.swap) {
                this.swap.setWallet(this.wallet);
            }
        } else if (provider instanceof Swap) {
            this.swap = provider;
            this.connectWallet();
            this.connectChain();
        }

        return this;
    }

    get chain() {
        return this._chain;
    }

    set chain(chain: ChainType) {
        this._chain = chain;
    }

    get wallet() {
        return this._wallet;
    }

    set wallet(wallet: WalletType) {
        this._wallet = wallet;
    }

    get swap() {
        return this._swap;
    }

    set swap(swap: SwapType) {
        this._swap = swap;
    }

    private connectChain() {
        const chain = this.wallet?.getChainProvider() as ChainType;
        if (chain) {
            this.chain = chain;
        }
    }

    private connectWallet() {
        const wallet = this.swap?.getWallet() as WalletType;
        if (wallet) {
            this.wallet = wallet;
        }
    }
}
