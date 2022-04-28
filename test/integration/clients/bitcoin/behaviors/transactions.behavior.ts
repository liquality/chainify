/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { BitcoinBaseWalletProvider, BitcoinTypes, BitcoinUtils } from '@chainify/bitcoin';
import { decodeRawTransaction } from '@chainify/bitcoin/dist/lib/utils';
import { UnimplementedMethodError } from '@chainify/errors';
import { BigNumber, Transaction } from '@chainify/types';
import { hash160 } from '@chainify/utils';
import * as bitcoinJs from 'bitcoinjs-lib';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { fundAddress, fundWallet, getNewAddress, mineBlock } from '../../../common';
import { Chain } from '../../../types';
import { getRandomBitcoinAddress } from '../utils';

chai.use(chaiAsPromised);

function testBatchTransaction(chain: Chain) {
    const { config, client } = chain;

    it('Sent value to 2 addresses', async () => {
        const addr1 = await getRandomBitcoinAddress(chain);
        const addr2 = await getRandomBitcoinAddress(chain);

        const value = config.sendParams.value || new BigNumber(1000000);

        const bal1Before = await client.chain.getBalance([addr1], []);
        const bal2Before = await client.chain.getBalance([addr2], []);
        await chain.client.wallet.sendBatchTransaction([
            { to: addr1, value },
            { to: addr2, value },
        ]);
        await mineBlock(chain);
        const bal1After = await client.chain.getBalance([addr1], []);
        const bal2After = await client.chain.getBalance([addr2], []);

        expect(bal1Before[0].plus(value).toString()).to.equal(bal1After.toString());
        expect(bal2Before[0].plus(value).toString()).to.equal(bal2After.toString());
    });
}

function testOpReturn(chain: Chain) {
    const { config, client } = chain;

    it('Send OP_RETURN script', async () => {
        const tx: Transaction<BitcoinTypes.Transaction> = await client.wallet.sendTransaction({
            to: null,
            value: new BigNumber(0),
            data: Buffer.from('freedom', 'utf-8').toString('hex'),
        });

        expect(tx._raw.vout.find((vout) => vout.scriptPubKey.hex === '6a0766726565646f6d')).to.exist;
        expect(tx._raw.vout.find((vout) => vout.scriptPubKey.asm.includes('OP_RETURN'))).to.exist;
    });

    it('Send Value & OP_RETURN', async () => {
        const to = await getRandomBitcoinAddress(chain);
        const value = config.sendParams.value || new BigNumber(1000000);
        const tx: Transaction<BitcoinTypes.Transaction> = await client.wallet.sendTransaction({
            to,
            value,
            data: Buffer.from('freedom', 'utf-8').toString('hex'),
        });

        // OP_RETURN exists
        expect(tx._raw.vout.find((vout) => vout.scriptPubKey.hex === '6a0766726565646f6d')).to.exist;
        expect(tx._raw.vout.find((vout) => vout.scriptPubKey.asm.includes('OP_RETURN'))).to.exist;

        // P2PKH exists
        expect(tx._raw.vout.find((vout) => vout.value === value.div(1e8).toNumber())).to.exist;
    });
}

function testSweepTransaction(chain: Chain) {
    describe('Sweep Transaction', () => {
        after(async function () {
            // After sweep, funds should be replenished
            await fundWallet(chain);
        });

        it('should sweep wallet balance', async () => {
            try {
                const changeAddresses = await chain.client.wallet.getAddresses(0, 20, true);

                for (let i = 1; i <= 5; i++) {
                    await fundAddress(chain, changeAddresses[i]);
                }

                const addr1 = await getRandomBitcoinAddress(chain);

                await chain.client.wallet.sendSweepTransaction(addr1, null);

                const balanceAfter = await chain.client.chain.getBalance(changeAddresses, []);
                expect(balanceAfter.toString()).to.equal('0');
            } catch (err) {
                if (!(err instanceof UnimplementedMethodError)) {
                    throw err;
                }
            }
        });
    });
}

function testSignPSBTSimple(chain: Chain) {
    it('should sign psbt a simple send', async () => {
        const network = chain.config.network as BitcoinTypes.BitcoinNetwork;

        const unusedAddressOne = await getNewAddress(chain);
        const tx1: Transaction<BitcoinTypes.Transaction> = await fundAddress(chain, unusedAddressOne.address, new BigNumber(2000000));
        const utxo1 = tx1._raw.vout.find((vout) => unusedAddressOne.address === vout.scriptPubKey.addresses[0]);
        const unusedAddressTwo = await getNewAddress(chain);
        const tx2: Transaction<BitcoinTypes.Transaction> = await fundAddress(chain, unusedAddressTwo.address, new BigNumber(1000000));
        const utxo2 = tx2._raw.vout.find((vout) => unusedAddressTwo.address === vout.scriptPubKey.addresses[0]);

        const psbt = new bitcoinJs.Psbt({ network });
        const txfee = BitcoinUtils.calculateFee(1, 1, 5);

        psbt.addInput({
            hash: tx1.hash,
            index: utxo1.n,
            sequence: 0,
            witnessUtxo: {
                script: Buffer.from(utxo1.scriptPubKey.hex, 'hex'),
                value: 2000000,
            },
        });

        psbt.addInput({
            hash: tx2.hash,
            index: utxo2.n,
            sequence: 0,
            witnessUtxo: {
                script: Buffer.from(utxo2.scriptPubKey.hex, 'hex'),
                value: 1000000,
            },
        });

        psbt.addOutput({
            address: (await getNewAddress(chain)).address,
            value: 3000000 - txfee,
        });

        const signedPSBTHex = await (chain.client.wallet as BitcoinBaseWalletProvider).signPSBT(psbt.toBase64(), [
            { index: 0, derivationPath: unusedAddressOne.derivationPath },
            { index: 1, derivationPath: unusedAddressTwo.derivationPath },
        ]);
        const signedPSBT = bitcoinJs.Psbt.fromBase64(signedPSBTHex, { network });
        signedPSBT.finalizeAllInputs();

        const hex = signedPSBT.extractTransaction().toHex();
        const payment3TxHash = await chain.client.chain.sendRawTransaction(hex);
        const payment3: Transaction<BitcoinTypes.Transaction> = await chain.client.chain.getTransactionByHash(payment3TxHash);

        expect(payment3._raw.vin.length).to.equal(2);
        expect(payment3._raw.vout.length).to.equal(1);
    });
}

function testSignPSBTScript(chain: Chain) {
    const { config, client } = chain;

    it('should send p2sh and sign PSBT to redeem', async () => {
        const network = config.network;
        const value = config.sendParams.value || new BigNumber(1000000);
        const OPS = bitcoinJs.script.OPS;

        const { address: unusedAddressOne, derivationPath: unusedAddressOneDerivationPath } = await getNewAddress(chain);
        await client.wallet.sendTransaction({ to: unusedAddressOne, value });
        await mineBlock(chain);

        const { address: unusedAddressTwo } = await getNewAddress(chain);

        const newAddresses = [unusedAddressOne];

        const addresses = [];
        for (const newAddress of newAddresses) {
            const address = await (client.wallet as BitcoinBaseWalletProvider).getWalletAddress(newAddress);
            addresses.push(address);
        }

        const multisigOutput = bitcoinJs.script.compile([
            OPS.OP_DUP,
            OPS.OP_HASH160,
            Buffer.from(hash160(addresses[0].publicKey), 'hex'),
            OPS.OP_EQUALVERIFY,
            OPS.OP_CHECKSIG,
        ]);

        const paymentVariant = bitcoinJs.payments.p2wsh({
            redeem: { output: multisigOutput, network: network as BitcoinTypes.BitcoinNetwork },
            network: network as BitcoinTypes.BitcoinNetwork,
        });

        const address = paymentVariant.address;

        const initiationTx: Transaction<BitcoinTypes.Transaction> = await client.wallet.sendTransaction({
            to: address,
            value,
        });

        await mineBlock(chain);

        let multiVout: BitcoinTypes.Output;

        for (const voutIndex in initiationTx._raw.vout) {
            const vout = initiationTx._raw.vout[voutIndex];
            const paymentVariantEntryOne = paymentVariant.output.toString('hex') === vout.scriptPubKey.hex;
            if (paymentVariantEntryOne) {
                multiVout = vout;
            }
        }

        const psbt = new bitcoinJs.Psbt({ network: network as BitcoinTypes.BitcoinNetwork });
        const txfee = BitcoinUtils.calculateFee(3, 3, 9);

        const input = {
            hash: initiationTx.hash,
            index: multiVout.n,
            sequence: 0,
            witnessUtxo: {
                script: paymentVariant.output,
                value: value.toNumber(),
            },
            witnessScript: paymentVariant.redeem.output,
        };

        const output = {
            address: unusedAddressTwo,
            value: value.toNumber() - txfee,
        };

        psbt.addInput(input);
        psbt.addOutput(output);

        const signedPSBTHex = await (client.wallet as BitcoinBaseWalletProvider).signPSBT(psbt.toBase64(), [
            { index: 0, derivationPath: unusedAddressOneDerivationPath },
        ]);
        const signedPSBT = bitcoinJs.Psbt.fromBase64(signedPSBTHex, { network: network as BitcoinTypes.BitcoinNetwork });
        signedPSBT.finalizeInput(0);

        const hex = signedPSBT.extractTransaction().toHex();

        const claimTxHash = await client.chain.sendRawTransaction(hex);

        await mineBlock(chain);

        const claimTxRaw = await client.chain.getProvider().getRawTransactionByHash(claimTxHash);
        const claimTx = decodeRawTransaction(claimTxRaw, network as BitcoinTypes.BitcoinNetwork);

        const claimVouts = claimTx.vout;
        const claimVins = claimTx.vin;

        expect(claimVins.length).to.equal(1);
        expect(claimVouts.length).to.equal(1);
    });
}

function testSignBatchP2SHTransaction(chain: Chain) {
    const { config } = chain;

    it("Should redeem two P2SH's", async () => {
        const network = chain.config.network as BitcoinTypes.BitcoinNetwork;
        const value = config.sendParams.value || new BigNumber(1000000);
        const OPS = bitcoinJs.script.OPS;

        const { address: unusedAddressOne } = await chain.client.wallet.getUnusedAddress();
        await chain.client.wallet.sendTransaction({ to: unusedAddressOne, value });
        await mineBlock(chain);

        const { address: unusedAddressTwo } = await chain.client.wallet.getUnusedAddress();

        const newAddresses = [unusedAddressOne, unusedAddressTwo];

        const addresses = [];
        for (const newAddress of newAddresses) {
            const address = await (chain.client.wallet as BitcoinBaseWalletProvider).getWalletAddress(newAddress);
            addresses.push(address);
        }

        const multisigOutputOne = bitcoinJs.script.compile([
            OPS.OP_2,
            Buffer.from(addresses[0].publicKey, 'hex'),
            Buffer.from(addresses[1].publicKey, 'hex'),
            OPS.OP_2,
            OPS.OP_CHECKMULTISIG,
        ]);

        const multisigOutputTwo = bitcoinJs.script.compile([
            OPS.OP_2,
            Buffer.from(addresses[1].publicKey, 'hex'),
            Buffer.from(addresses[0].publicKey, 'hex'),
            OPS.OP_2,
            OPS.OP_CHECKMULTISIG,
        ]);

        const paymentVariantOne = bitcoinJs.payments.p2wsh({
            redeem: { output: multisigOutputOne, network: network as BitcoinTypes.BitcoinNetwork },
            network: network as BitcoinTypes.BitcoinNetwork,
        });
        const paymentVariantTwo = bitcoinJs.payments.p2wsh({
            redeem: { output: multisigOutputTwo, network: network as BitcoinTypes.BitcoinNetwork },
            network: network as BitcoinTypes.BitcoinNetwork,
        });

        const addressOne = paymentVariantOne.address;
        const addressTwo = paymentVariantTwo.address;

        const initiationTx = (
            await chain.client.wallet.sendBatchTransaction([
                { to: addressOne, value },
                { to: addressTwo, value },
            ])
        )[0];
        await mineBlock(chain);

        const multiOne: any = {};
        const multiTwo: any = {};

        for (const voutIndex in initiationTx._raw.vout) {
            const vout = initiationTx._raw.vout[voutIndex];
            const paymentVariantEntryOne = paymentVariantOne.output.toString('hex') === vout.scriptPubKey.hex;
            const paymentVariantEntryTwo = paymentVariantTwo.output.toString('hex') === vout.scriptPubKey.hex;
            if (paymentVariantEntryOne) multiOne.multiVout = vout;
            if (paymentVariantEntryTwo) multiTwo.multiVout = vout;
        }

        const txb = new bitcoinJs.TransactionBuilder(network as BitcoinTypes.BitcoinNetwork);
        const txfee = BitcoinUtils.calculateFee(3, 3, 9);

        multiOne.multiVout.vSat = value.toNumber();
        multiTwo.multiVout.vSat = value.toNumber();

        txb.addInput(initiationTx.hash, multiOne.multiVout.n, 0, paymentVariantOne.output);
        txb.addInput(initiationTx.hash, multiTwo.multiVout.n, 0, paymentVariantTwo.output);
        txb.addOutput(unusedAddressTwo, value.toNumber() * 2 - txfee);

        const tx = txb.buildIncomplete();

        const signaturesOne = await (chain.client.wallet as BitcoinBaseWalletProvider).signBatchP2SHTransaction(
            [
                {
                    inputTxHex: initiationTx._raw.hex,
                    index: 0,
                    vout: multiOne.multiVout,
                    outputScript: paymentVariantOne.redeem.output,
                },
                {
                    inputTxHex: initiationTx._raw.hex,
                    index: 1,
                    vout: multiTwo.multiVout,
                    outputScript: paymentVariantTwo.redeem.output,
                },
            ],
            [addresses[0].address, addresses[0].address] as any,
            tx,
            0,
            true
        );

        const signaturesTwo = await (chain.client.wallet as BitcoinBaseWalletProvider).signBatchP2SHTransaction(
            [
                {
                    inputTxHex: initiationTx._raw.hex,
                    index: 0,
                    vout: multiOne.multiVout,
                    outputScript: paymentVariantOne.redeem.output,
                },
                {
                    inputTxHex: initiationTx._raw.hex,
                    index: 1,
                    vout: multiTwo.multiVout,
                    outputScript: paymentVariantTwo.redeem.output,
                },
            ],
            [addresses[1].address, addresses[1].address] as any,
            tx,
            0,
            true
        );

        const multiOneInput = bitcoinJs.script.compile([OPS.OP_0, signaturesOne[0], signaturesTwo[0]]);

        const multiTwoInput = bitcoinJs.script.compile([OPS.OP_0, signaturesTwo[1], signaturesOne[1]]);

        multiOne.paymentParams = { redeem: { output: multisigOutputOne, input: multiOneInput, network }, network };
        multiTwo.paymentParams = { redeem: { output: multisigOutputTwo, input: multiTwoInput, network }, network };

        multiOne.paymentWithInput = bitcoinJs.payments.p2wsh(multiOne.paymentParams);
        multiTwo.paymentWithInput = bitcoinJs.payments.p2wsh(multiTwo.paymentParams);

        tx.setWitness(0, multiOne.paymentWithInput.witness);
        tx.setWitness(1, multiTwo.paymentWithInput.witness);

        const claimTxHash = await chain.client.chain.sendRawTransaction(tx.toHex());

        await mineBlock(chain);

        const claimTxRaw = await chain.client.chain.getProvider().getRawTransactionByHash(claimTxHash);
        const claimTx = decodeRawTransaction(claimTxRaw, network);

        const claimVouts = claimTx.vout;
        const claimVins = claimTx.vin;

        expect(claimVins.length).to.equal(2);
        expect(claimVouts.length).to.equal(1);
    });
}

export function shouldBehaveLikeBitcoinTransaction(chain: Chain) {
    describe('Bitcoin Transactions', () => {
        testBatchTransaction(chain);
        testSignPSBTSimple(chain);
        testSignPSBTScript(chain);
        testSignBatchP2SHTransaction(chain);
        testSweepTransaction(chain);

        if (chain.name !== 'btc-node-wallet') {
            testOpReturn(chain);
        }
    });
}
