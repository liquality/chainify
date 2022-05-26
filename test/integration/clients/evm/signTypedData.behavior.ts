import { SignTypedDataVersion } from '@metamask/eth-sig-util';
import { constants } from 'ethers';
import { Chain } from '../../types';
import { shouldBehaveLikeSignTypedData } from '../../wallet/sign.typed.data.test';

export function shouldSignTypedData(chain: Chain) {
    const { config } = chain;

    describe('EVM Sign Typed Data V1', () => {
        shouldBehaveLikeSignTypedData(
            chain,
            [
                {
                    from: config.walletExpectedResult.address,
                    data: [{ name: 'data', type: 'bool', value: true }],
                    version: SignTypedDataVersion.V1,
                },
                {
                    from: config.walletExpectedResult.address,
                    data: [{ name: 'data', type: 'address', value: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' }],
                    version: SignTypedDataVersion.V1,
                },
                {
                    from: config.walletExpectedResult.address,
                    data: [{ name: 'data', type: 'uint256', value: constants.MaxUint256.toString() }],
                    version: SignTypedDataVersion.V1,
                },
            ],
            [
                '0xd0a129a8c632d51d862eaaa275771fc591f7af09ce925659e662ac3a5f9d41e70191331b3268c65ac3a6e52d5d81aa0748faf422f05ad53bcc3b5228f9f6e19a1b',
                '0x082c2c7966de680ef2f5218cb0fe3d32e736142dc37e10dd5460db0bc817b0305207e1297d7c7e161c61ca83d24fee78c16be17bb9b434502379a9455e24be1b1b',
                '0xbbf349db7ba258e2d968a46105c6371b91f0919cbcf3c149a841a5108a98ff2c67df2dd6e67a0abea5d1f852ba1afc87d1886a43c53133054bfd547376d184ae1c',
            ],
            ['bool', 'address', 'uint256']
        );
    });

    describe('EVM Sign Typed Data V3', () => {
        shouldBehaveLikeSignTypedData(
            chain,
            [
                {
                    from: config.walletExpectedResult.address,
                    data: {
                        types: {
                            EIP712Domain: [],
                        },
                        primaryType: 'EIP712Domain',
                        domain: {},
                        message: {},
                    },
                    version: SignTypedDataVersion.V3,
                },
                {
                    from: config.walletExpectedResult.address,
                    data: {
                        types: {
                            EIP712Domain: [
                                {
                                    name: 'name',
                                    type: 'string',
                                },
                                {
                                    name: 'version',
                                    type: 'string',
                                },
                                {
                                    name: 'chainId',
                                    type: 'uint256',
                                },
                                {
                                    name: 'verifyingContract',
                                    type: 'address',
                                },
                                {
                                    name: 'salt',
                                    type: 'bytes32',
                                },
                            ],
                        },
                        primaryType: 'EIP712Domain',
                        domain: {
                            name: 'example.metamask.io',
                            version: '1',
                            chainId: 1,
                            verifyingContract: '0x0000000000000000000000000000000000000000',
                            salt: Buffer.from(new Int32Array([1, 2, 3])),
                        },
                        message: {},
                    },
                    version: SignTypedDataVersion.V3,
                },
            ],
            [
                '0x14fae15c5cb89549299c0f70a58b6fe4f5fc89f632a5d4a84afb680c149d3f7b74008c147e7d098d6e02b4101a50d33cb220afee720825660bd0a14e4cd2b3461c',
                '0x6b5241eb407c6d1d101f1b23363fc48f258dbcf93c4265a3b7b08b67a04b85f225c5cc62b834d3b5fc0a340774111d9488f0c07070917a3cc8af4d07453560b51c',
            ],
            ['minimal', 'all fields']
        );
    });

    describe('EVM Sign Typed Data V4', () => {
        shouldBehaveLikeSignTypedData(
            chain,
            [
                {
                    from: config.walletExpectedResult.address,
                    data: {
                        types: {
                            EIP712Domain: [],
                        },
                        primaryType: 'EIP712Domain',
                        domain: {},
                        message: {},
                    },
                    version: SignTypedDataVersion.V4,
                },
                {
                    from: config.walletExpectedResult.address,
                    data: {
                        types: {
                            EIP712Domain: [
                                {
                                    name: 'name',
                                    type: 'string',
                                },
                                {
                                    name: 'version',
                                    type: 'string',
                                },
                                {
                                    name: 'chainId',
                                    type: 'uint256',
                                },
                                {
                                    name: 'verifyingContract',
                                    type: 'address',
                                },
                                {
                                    name: 'salt',
                                    type: 'bytes32',
                                },
                            ],
                        },
                        primaryType: 'EIP712Domain',
                        domain: {
                            name: 'example.metamask.io',
                            version: '1',
                            chainId: 1,
                            verifyingContract: '0x0000000000000000000000000000000000000000',
                            salt: Buffer.from(new Int32Array([1, 2, 3])),
                        },
                        message: {},
                    },
                    version: SignTypedDataVersion.V4,
                },
                {
                    from: config.walletExpectedResult.address,
                    data: {
                        types: {
                            EIP712Domain: [
                                {
                                    name: 'customName',
                                    type: 'string',
                                },
                                {
                                    name: 'customVersion',
                                    type: 'string',
                                },
                                {
                                    name: 'customChainId',
                                    type: 'uint256',
                                },
                                {
                                    name: 'customVerifyingContract',
                                    type: 'address',
                                },
                                {
                                    name: 'customSalt',
                                    type: 'bytes32',
                                },
                                {
                                    name: 'extraField',
                                    type: 'string',
                                },
                            ],
                        },
                        primaryType: 'EIP712Domain',
                        domain: {
                            customName: 'example.metamask.io',
                            customVersion: '1',
                            customChainId: 1,
                            customVerifyingContract: '0x0000000000000000000000000000000000000000',
                            customSalt: Buffer.from(new Int32Array([1, 2, 3])),
                            extraField: 'stuff',
                        },
                        message: {},
                    },
                    version: SignTypedDataVersion.V4,
                },
            ],
            [
                '0x14fae15c5cb89549299c0f70a58b6fe4f5fc89f632a5d4a84afb680c149d3f7b74008c147e7d098d6e02b4101a50d33cb220afee720825660bd0a14e4cd2b3461c',
                '0x6b5241eb407c6d1d101f1b23363fc48f258dbcf93c4265a3b7b08b67a04b85f225c5cc62b834d3b5fc0a340774111d9488f0c07070917a3cc8af4d07453560b51c',
                '0xb764bca9a5ef7f1868ae81bfb10a5a98712ba1a88c0a0668e78b356664edad114019900710a68784d1685b30be23281478828c054c3afc2b4326bf2ec3138a691c',
            ],
            ['minimal', 'all fields', 'extra fields']
        );
    });
}
