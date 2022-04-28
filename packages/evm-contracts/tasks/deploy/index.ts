// // @ts-nocheck
// // @ts-ignore
// import { LiqualityHTLC__factory, Multicall__factory } from '@chainify/evm/lib/typechain';
// import { task } from 'hardhat/config';
// import { TaskArguments } from 'hardhat/types';
// import { create2_deployer_abi, create2_deployer_bytecode } from '../utils';

// task('deploy:HTLC').setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     const funder = (await ethers.getSigners())[0];
//     const privateKey = '';
//     const wallet = new ethers.Wallet(privateKey, funder.provider);
//     console.log('Wallet address: ', wallet.address);
//     console.log('Wallet balance: ', await wallet.getBalance());

//     const create2_factory = new ethers.ContractFactory(create2_deployer_abi, create2_deployer_bytecode, wallet);
//     const create2DeployTx = await create2_factory.deploy({ gasLimit: 500000, nonce: 0 });

//     const factory = new ethers.Contract(create2DeployTx.address, create2_deployer_abi, wallet);
//     console.log('Factory address', factory.address);

//     // TODO: add salt
//     const salt = '';
//     const htlc = await factory.deploy(LiqualityHTLC__factory.bytecode, salt, { gasLimit: 1500000, nonce: 1 });
//     const receipt = await htlc.wait();

//     const addr = ethers.utils.getCreate2Address(factory.address, salt, ethers.utils.keccak256(LiqualityHTLC__factory.bytecode));
//     const event = create2_factory.interface.parseLog(receipt.logs[0]);

//     console.log('HTLC address computed: ', addr);
//     console.log('HTLC address from event: ', event.args.addr);
// });

// task('deploy:Multicall').setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     const funder = (await ethers.getSigners())[0];
//     const privateKey = '';
//     const wallet = new ethers.Wallet(privateKey, funder.provider);
//     console.log('Wallet address: ', wallet.address);
//     console.log('Wallet balance: ', await wallet.getBalance());
//     const multicallFactory = new Multicall__factory(wallet);
//     const create2DeployTx = await multicallFactory.deploy({ gasLimit: 800000 });
//     console.log('Multicall address', create2DeployTx.address);
// });
