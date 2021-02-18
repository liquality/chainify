import { Client, Provider as IProvider } from '@liquality/types'

export default class Provider implements IProvider {
  client: Client
  /**
   * Set client to a provider instance.
   * @param {!ChainAbstractionLayer} client - The ChainAbstractionLayer instance
   */ 
  setClient (client: Client) {
    this.client = client
  }

  /**
   * Get method for the provider
   * @param {!string} method - Name of the method
   * @return {function} Returns a method from a provider above current Provider
   *  in the stack.
   */
  getMethod (method: string, requestor = this) {
    return this.client.getMethod(method, requestor).bind(this)
  }
}
