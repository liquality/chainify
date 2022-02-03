import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { LiqualityHTLC } from "../src/types/LiqualityHTLC";
import { TestERC20 } from "../src/types/TestERC20";

declare module "mocha" {
  export interface Context {
    htlc: LiqualityHTLC;
    token: TestERC20;
    signers: Signers;
  }
}

export interface Signers {
  deployer: SignerWithAddress;
  sender: SignerWithAddress;
  recipient: SignerWithAddress;
}
