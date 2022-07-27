import Chain from './Chain';
import Nft from './Nft';
import Swap from './Swap';
import Wallet from './Wallet';

export default class Client<
    ChainType extends Chain<any> = Chain<any>,
    WalletType extends Wallet<any, any> = Wallet<any, any>,
    SwapType extends Swap<any, any> = Swap<any, any>,
    NftType extends Nft<any, any> = Nft<any, any>
> {
    private _chain: ChainType;
    private _wallet: WalletType;
    private _swap: SwapType;
    private _nft: NftType;

    constructor(chain?: ChainType, wallet?: WalletType, swap?: SwapType, nft?: NftType) {
        this._chain = chain;
        this._wallet = wallet;
        this._swap = swap;
        this._nft = nft;
    }

    connect(provider: ChainType | WalletType | SwapType | NftType) {
        switch (true) {
            case provider instanceof Chain: {
                this.chain = provider as ChainType;
                if (this.wallet) {
                    this.wallet.setChainProvider(this.chain);
                }
                break;
            }

            case provider instanceof Wallet: {
                this.wallet = provider as WalletType;
                this.connectChain();

                if (this.swap) {
                    this.swap.setWallet(this.wallet);
                }

                if (this.nft) {
                    this.nft.setWallet(this.wallet);
                }
                break;
            }

            case provider instanceof Swap: {
                this.swap = provider as SwapType;
                this.connectWallet(this.swap);
                if (this.nft) {
                    this.nft.setWallet(this.wallet);
                }
                this.connectChain();
                break;
            }

            case provider instanceof Nft: {
                this._nft = provider as NftType;
                this.connectWallet(this.nft);
                if (this.swap) {
                    this.swap.setWallet(this.wallet);
                }
                this.connectChain();
                break;
            }
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

    get nft() {
        return this._nft;
    }

    set nft(nft: NftType) {
        this._nft = nft;
    }

    private connectChain() {
        const chain = this.wallet?.getChainProvider() as ChainType;
        if (chain) {
            this.chain = chain;
        }
    }

    private connectWallet(source: SwapType | NftType) {
        const wallet = source?.getWallet() as WalletType;
        if (wallet) {
            this.wallet = wallet;
        }
    }
}
