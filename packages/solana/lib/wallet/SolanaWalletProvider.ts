import { Wallet } from '@chainify/client';
import { UnimplementedMethodError } from '@chainify/errors';
import { Logger } from '@chainify/logger';
import {
    Address,
    AddressType,
    Asset,
    BigNumber,
    FeeType,
    Network,
    Transaction,
    TransactionRequest,
    TxStatus,
    WalletOptions,
} from '@chainify/types';
import { base58, retry } from '@chainify/utils';
import {
    createAccount,
    createTransferInstruction,
    getAccount,
    getAssociatedTokenAddress,
    TokenAccountNotFoundError,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction as SolTransaction, TransactionInstruction } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { SolanaTxRequest } from 'lib/types';
import nacl from 'tweetnacl';
import { SolanaChainProvider } from '../';

const logger = new Logger('SolanaWalletProvider');

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

    public async sendTransaction(txRequest: SolanaTxRequest): Promise<Transaction> {
        let transaction: SolTransaction;

        const latestBlockhash = await retry(async () => this.chainProvider.getProvider().getLatestBlockhash('confirmed'));

        // Handle already builded transactions that are passed from outside - Jupiter for example
        if (txRequest.transaction) {
            transaction = txRequest.transaction;
            transaction.recentBlockhash = latestBlockhash.blockhash;
        } else {
            let instruction: TransactionInstruction;
            const to = new PublicKey(txRequest.to.toString());

            // Handle ERC20 Transactions
            if (txRequest.asset && !txRequest.asset.isNative) {
                const contractAddress = new PublicKey(txRequest.asset.contractAddress);

                const [fromTokenAccount, toTokenAccount] = await Promise.all([
                    getAssociatedTokenAddress(contractAddress, this._signer.publicKey),
                    getAssociatedTokenAddress(contractAddress, to),
                ]);

                try {
                    await getAccount(this.chainProvider.getProvider(), toTokenAccount);
                } catch (err) {
                    if (err instanceof TokenAccountNotFoundError) {
                        await createAccount(this.chainProvider.getProvider(), this._signer, contractAddress, to);
                    } else {
                        logger.debug(`Error creating account`, err);
                    }
                }

                instruction = createTransferInstruction(fromTokenAccount, toTokenAccount, this._signer.publicKey, Number(txRequest.value));
            } else {
                // Handle SOL Transactions
                instruction = SystemProgram.transfer({
                    fromPubkey: this._signer.publicKey,
                    toPubkey: to,
                    lamports: txRequest.value.toNumber(),
                });
            }

            transaction = new SolTransaction({ recentBlockhash: latestBlockhash.blockhash }).add(instruction);
        }

        const hash = await this.chainProvider.getProvider().sendTransaction(transaction, [this._signer], {
            skipPreflight: true,
        });

        return {
            hash,
            value: txRequest.value.toNumber(),
            to: txRequest.to,
            from: this._signer.publicKey.toBase58(),
            _raw: {},
            confirmations: 0,
            status: TxStatus.Pending,
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

    protected onChainProviderUpdate(_chainProvider: SolanaChainProvider): void {
        // do nothing
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
