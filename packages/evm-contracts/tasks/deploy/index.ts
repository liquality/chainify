// import { task } from 'hardhat/config';
// import { TaskArguments } from 'hardhat/types';
// import { LiqualityHTLC__factory } from '../../src/types/factories/LiqualityHTLC__factory';
// import { create2_deployer_abi, create2_deployer_bytecode } from '../utils';

// task('deploy:HTLC').setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     const funder = (await ethers.getSigners())[0];

//     // TODO: add PK
//     const privateKey = '';
//     const wallet = new ethers.Wallet(privateKey, funder.provider);
//     console.log('Wallet address:', wallet.address);

//     const create2_factory = new ethers.ContractFactory(create2_deployer_abi, create2_deployer_bytecode, wallet);
//     const create2DeployTx = await create2_factory.deploy({ gasLimit: 500000 });

//     const factory = new ethers.Contract(create2DeployTx.address, create2_deployer_abi, wallet);
//     console.log('Factory address', factory.address);

//     // TODO: add salt
//     const salt = '';
//     const htlc = await factory.deploy(LiqualityHTLC__factory.bytecode, salt, { gasLimit: 1000000 });
//     const receipt = await htlc.wait();

//     const addr = ethers.utils.getCreate2Address(factory.address, salt, ethers.utils.keccak256(LiqualityHTLC__factory.bytecode));
//     const event = create2_factory.interface.parseLog(receipt.logs[0]);

//     console.log(event.args.addr);
//     console.log(addr);
// });
