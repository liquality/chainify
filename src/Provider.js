export default class Provider {
  setClient (client) {
    this.client = client
  }

  getMethod (method) {
    return this.client.getProviderForMethod(method, this)[method]
  }
}
