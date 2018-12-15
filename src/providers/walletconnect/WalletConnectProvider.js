import WalletConnect from "walletconnect";
import WalletConnectQRCodeModal from "walletconnect-qrcode-modal";
import Provider from '../../Provider'

export default class WalletConnectProvider extends Provider {
  constructor () {
    super()
    /*if (!isFunction(metamaskProvider.sendAsync)) {
      throw new Error('Invalid MetaMask Provider')
    }

    this._metamaskProvider = metamaskProvider
    this._networkId = parseInt(networkId)
    */
    this.webConnector = new WalletConnect({
      bridgeUrl: 'https://test-bridge.walletconnect.org', // Required
      dappName: 'liquality' // Required
    });
  }
}
