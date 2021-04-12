import Provider from "@liquality/provider";
import { addressToString } from "@liquality/utils";
import { NearNetwork } from "@liquality/near-networks";
import { Address, near } from "@liquality/types";
import { normalizeTransactionObject } from "@liquality/near-utils";
import BigNumber from "bignumber.js";

import { InMemorySigner, KeyPair } from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { transfer } from "near-api-js/lib/transaction";
import { parseSeedPhrase } from "near-seed-phrase";

export default class NearJsWalletProvider extends Provider {
  _network: NearNetwork;
  _mnemonic: string;
  _derivationPath: string;
  _keyStore: InMemoryKeyStore;

  constructor(network: NearNetwork, mnemonic: string) {
    super();
    this._network = network;
    this._mnemonic = mnemonic;
    this._derivationPath = `m/44'/${network.coinType}'/0'`;
    this._keyStore = new InMemoryKeyStore();
  }

  async getAddresses(): Promise<Address[]> {
    const { publicKey, secretKey } = parseSeedPhrase(
      this._mnemonic,
      this._derivationPath
    );
    const keyPair = KeyPair.fromString(secretKey);
    const address = Buffer.from(keyPair.getPublicKey().data).toString("hex");
    await this._keyStore.setKey(this._network.networkId, address, keyPair);

    return [
      new Address({
        address,
        derivationPath: this._derivationPath,
        publicKey,
      }),
    ];
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses();
    return addresses[0];
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses();
  }

  getSigner(): InMemorySigner {
    return new InMemorySigner(this._keyStore);
  }

  async signMessage(message: string): Promise<string> {
    const addresses = await this.getAddresses();

    const signed = await this.getSigner().signMessage(
      Buffer.from(message),
      addressToString(addresses[0]),
      this._network.networkId
    );

    return Buffer.from(signed.signature).toString("hex");
  }

  async sendTransaction(
    to: string,
    value: number,
    actions: any[]
  ): Promise<near.NormalizedTransaction> {
    const addresses = await this.getAddresses();
    const from = await this.getMethod("getAccount")(
      addressToString(addresses[0]),
      this.getSigner()
    );

    if (!actions) {
      actions = [transfer(new BigNumber(value).toFixed().toString() as any)];
    }

    const tx = await from.signAndSendTransaction(addressToString(to), actions);
    return normalizeTransactionObject(tx);
  }

  async sendSweepTransaction(
    address: string
  ): Promise<near.NormalizedTransaction> {
    const addresses = await this.getAddresses();
    const from = await this.getMethod("getAccount")(
      addressToString(addresses[0]),
      this.getSigner()
    );

    const tx = await from.deleteAccount(addressToString(address));
    return normalizeTransactionObject(tx);
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses();
    return addresses.length > 0;
  }

  async getWalletNetworkId(): Promise<string> {
    return this._network.networkId;
  }

  canUpdateFee(): boolean {
    return false;
  }
}
