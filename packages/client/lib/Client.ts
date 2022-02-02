export default class Client<ChainType = any, WalletType = any, SwapType = any> {
    private _chain: ChainType;
    private _wallet: WalletType;
    private _swap: SwapType;

    constructor(chain?: ChainType, wallet?: WalletType, swap?: SwapType) {
        this._chain = chain;
        this._wallet = wallet;
        this._swap = swap;
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
}
