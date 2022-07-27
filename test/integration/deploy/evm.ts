import { Client } from '@chainify/client';
import { Typechain } from '@chainify/evm';
import { constants, ethers } from 'ethers';

/**
 * The deploy step should always comes first before executing any tests.
 * The order of deployment is also important, because that determines the contract addresses.
 * Please make sure that no transactions are executed before the deploy step.
 */
export async function deployEvmContracts(client: Client) {
    const signer = client.wallet.getSigner();
    const erc20 = await new Typechain.TestERC20__factory().connect(signer).deploy();
    await new Typechain.Multicall3__factory().connect(signer).deploy();
    const htlc = await new Typechain.LiqualityHTLC__factory().connect(signer).deploy();

    // Mint tokens to the first 10 addresses
    const userAddress = await client.wallet.getAddresses(0, 10);
    for (const user of userAddress) {
        await erc20.mint(user.toString(), ethers.utils.parseEther('1000000000'));
        await erc20.approve(htlc.address, constants.MaxUint256);
    }
}
