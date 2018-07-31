export default class Provider {
  setClient (client) {
    this.client = client
  }

  getMethod (method) {
    const provider = this.client.getProviderForMethod(method, this)
    return provider[method].bind(provider)
  }
}
