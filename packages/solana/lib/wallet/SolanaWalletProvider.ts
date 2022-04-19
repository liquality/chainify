import { Wallet } from '@liquality/client';
import { base58 } from '@liquality/crypto';
import { UnimplementedMethodError } from '@liquality/errors';
import { Address, AddressType, Asset, BigNumber, FeeType, Network, Transaction, TransactionRequest, WalletOptions } from '@liquality/types';
import { createAccount, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction as SolTransaction, TransactionInstruction } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { SolanaChainProvider } from '../';

export class SolanaWalletProvider extends Wallet<Connection, Promise<Keypair>> {
    private _signer: Keypair;
    private _mnemonic: string;
    private _derivationPath: string;
    private _addressCache: { [key: string]: Address };

    constructor(walletOptions: WalletOptions, chainProvider?: SolanaChainProvider) {
        const { mnemonic, derivationPath } = walletOptions;
        super(chainProvider);

        this._mnemonic = mnemonic;
        this._derivationPath = derivationPath;
        this._addressCache = {};
        this._signer = this.setSigner();
    }

    public async getConnectedNetwork(): Promise<Network> {
        return this.chainProvider.getNetwork();
    }

    public async getSigner(): Promise<Keypair> {
        return this._signer;
    }

    public async getAddress(): Promise<Address> {
        if (this._addressCache[this._mnemonic]) {
            return this._addressCache[this._mnemonic];
        }

        const result = new Address({
            address: this._signer.publicKey.toString(),
            publicKey: this._signer.publicKey.toString(),
            derivationPath: this._derivationPath,
        });

        this._addressCache[this._mnemonic] = result;
        return result;
    }

    public async getUnusedAddress(): Promise<Address> {
        const addresses = await this.getAddresses();
        return addresses[0];
    }

    public async getUsedAddresses(): Promise<Address[]> {
        return await this.getAddresses();
    }

    public async getAddresses(): Promise<Address[]> {
        const address = await this.getAddress();
        return [address];
    }

    public async signMessage(message: string, _from: AddressType): Promise<string> {
        const buffer = Buffer.from(message);
        const signature = nacl.sign.detached(buffer, base58.decode(base58.encode(this._signer.secretKey)));

        return Buffer.from(signature).toString('hex');
    }

    public async sendTransaction(txRequest: TransactionRequest): Promise<Transaction> {
        const to = new PublicKey(txRequest.to.toString());

        let instruction: TransactionInstruction;
        // Handle ERC20 Transactions
        if (txRequest.asset && !txRequest.asset.isNative) {
            const contractAddress = new PublicKey(txRequest.asset.contractAddress);
            const fromTokenAccount = await getAssociatedTokenAddress(contractAddress, this._signer.publicKey);

            try {
                await createAccount(this.chainProvider.getProvider(), this._signer, contractAddress, to);
            } catch {}

            const toTokenAccount = await getAssociatedTokenAddress(contractAddress, to);

            instruction = createTransferInstruction(fromTokenAccount, toTokenAccount, this._signer.publicKey, Number(txRequest.value));
        } else {
            // Handle SOL Transactions
            instruction = SystemProgram.transfer({
                fromPubkey: this._signer.publicKey,
                toPubkey: to,
                lamports: txRequest.value.toNumber(),
            });
        }

        const latestBlockhash = await this.chainProvider.getProvider().getLatestBlockhash();

        const transaction = new SolTransaction({
            recentBlockhash: latestBlockhash.blockhash,
        }).add(instruction);

        const hash = await this.chainProvider.getProvider().sendTransaction(transaction, [this._signer]);
        return {
            hash,
            value: txRequest.value.toNumber(),
            _raw: {},
        };
    }

    public async sendBatchTransaction(txRequests: TransactionRequest[]): Promise<Transaction[]> {
        const result: Transaction[] = [];
        for (const txRequest of txRequests) {
            const tx = await this.sendTransaction(txRequest);
            result.push(tx);
        }
        return result;
    }

    public async sendSweepTransaction(address: AddressType, asset: Asset): Promise<Transaction> {
        const addresses = await this.getAddresses();
        const balance = await this.chainProvider.getBalance(addresses, [asset]);
        return await this.sendTransaction({ to: address, value: balance[0] });
    }

    public async updateTransactionFee(_tx: string | Transaction<any>, _newFee: FeeType): Promise<Transaction<any>> {
        throw new UnimplementedMethodError('Method not supported.');
    }

    public async getBalance(assets: Asset[]): Promise<BigNumber[]> {
        const user = await this.getAddress();
        return await this.chainProvider.getBalance([user], assets);
    }

    public async exportPrivateKey(): Promise<string> {
        return base58.encode(this._signer.secretKey);
    }

    public async isWalletAvailable(): Promise<boolean> {
        const addresses = await this.getAddresses();
        return addresses.length > 0;
    }

    public canUpdateFee(): boolean {
        return false;
    }

    private mnemonicToSeed(mnemonic: string) {
        if (!mnemonic) {
            throw new Error('Invalid seed words');
        }

        const seed = mnemonicToSeedSync(mnemonic);
        return Buffer.from(seed).toString('hex');
    }

    private setSigner(): Keypair {
        const seed = this.mnemonicToSeed(this._mnemonic);
        const derivedSeed = derivePath(this._derivationPath, seed).key;
        return Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
    }
}
