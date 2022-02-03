# Liquality HTLC

## Gas usage

### Ether HTLC
<img width="900" alt="Screenshot 2022-01-27 at 16 25 27" src="https://user-images.githubusercontent.com/7030722/151378268-0c503bc1-5915-4e9e-8825-1a0892074bef.png">

### ERC20 HTLC
<img width="903" alt="Screenshot 2022-01-27 at 16 26 07" src="https://user-images.githubusercontent.com/7030722/151378336-de923bf3-d743-4941-a6e1-f8dc18e9ddd4.png">

### Coverage
<img width="741" alt="Screenshot 2022-01-27 at 16 28 40" src="https://user-images.githubusercontent.com/7030722/151378625-715934a4-f358-4712-bc8f-840ba2a2f179.png">




## Usage

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.4+commit.c7e474f2",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.4+commit.c7e474f2` can be replaced with any other version.
