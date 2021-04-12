/* eslint-env mocha */
import chai, { expect } from "chai";

import Client from "../../../client/lib";
import NearRpcProvider from "../../lib";

chai.config.truncateThreshold = 0;

describe("Near RPC provider", () => {
  let client: Client;
  let provider: NearRpcProvider;

  beforeEach(() => {
    client = new Client();
    provider = new NearRpcProvider({
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    });
    client.addProvider(provider);
  });

  describe("getBlockHeight", () => {
    it("should return block height", async () => {
      const height = await client.chain.getBlockHeight();
      console.log("height ", height);
    });
  });

  describe("getBalance", () => {
    it("should return correct balance", async () => {
      const balance = await client.chain.getBalance(["krasi"]);
      console.log("balance: ", balance);
    });
  });

  describe("getBalance", () => {
    it("should return correct balance", async () => {
      const balance = await client.chain.getBalance(["non-existing-account"]);
      expect(balance.toString()).equal("0");
    });
  });

  describe("getGasPrice", () => {
    it("should return correct balance", async () => {
      console.log(client.chain);
      const gasPrice = await provider.getGasPrice();
      console.log("gas price: ", gasPrice);
    });
  });
});
