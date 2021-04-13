import { IClient } from '@liquality/types'

export default abstract class Provider {
  client: IClient
  /**
   * Set client to a provider instance.
   * @param {!ChainAbstractionLayer} client - The ChainAbstractionLayer instance
   */
  setClient(client: IClient) {
    this.client = client
  }

  /**
   * Get method for the provider
   * @param {!string} method - Name of the method
   * @return {function} Returns a method from a provider above current Provider
   *  in the stack.
   */
  getMethod(method: string, requestor: any = this) {
    return this.client.getMethod(method, requestor).bind(this)
  }
}
