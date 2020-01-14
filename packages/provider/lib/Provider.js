import { version } from '../package.json'

export default class Provider {
  /**
   * Set client to a provider instance.
   * @param {!ChainAbstractionLayer} client - The ChainAbstractionLayer instance
   */
  setClient (client) {
    this.client = client
  }

  /**
   * Get method for the provider
   * @param {!string} method - Name of the method
   * @return {function} Returns a method from a provider above current Provider
   *  in the stack.
   */
  getMethod (method, requestor = this) {
    return this.client.getMethod(method, requestor).bind(this)
  }
}

Provider.version = version
