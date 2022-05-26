import { expect } from 'chai';
import { Chain } from '../types';

export function shouldBehaveLikeSignTypedData(chain: Chain, inputs: any[], expected: string[], info: string[]) {
    const { client } = chain;

    describe(`${client.chain.getNetwork().name} Sign Typed Data`, function () {
        for (let i = 0; i < inputs.length; i++) {
            it(info[i], async () => {
                const result = await chain.client.wallet.signTypedData(inputs[i]);
                expect(result).to.be.equal(expected[i]);
            });
        }
    });
}
