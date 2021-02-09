import { version } from '../package.json'

export default {
  mainnet: {
    name: 'mainnet',
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
    coinType: '397',
    isTestnet: false
  },
  testnet: {
    name: 'testnet',
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
    coinType: '397',
    isTestnet: true
  },
  betanet: {
    name: 'betanet',
    networkId: 'betanet',
    nodeUrl: 'https://rpc.betanet.near.org',
    walletUrl: 'https://wallet.betanet.near.org',
    helperUrl: 'https://helper.betanet.near.org',
    explorerUrl: 'https://explorer.betanet.near.org',
    coinType: '397',
    isTestnet: true
  },
  local: {
    name: 'local',
    networkId: 'local',
    nodeUrl: 'http://localhost:3030',
    keyPath: `${process.env.HOME}/.near/validator_key.json`,
    walletUrl: 'http://localhost:4000/wallet',
    coinType: '397',
    isTestnet: true
  },

  version
}
