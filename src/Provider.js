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
  getMethod (method) {
    const provider = this.client.getProviderForMethod(method, this)
    return provider[method].bind(provider)
  }
}
