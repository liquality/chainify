const ChainAbstractionLayer = require('../../../')

class X {
  setClient (client) {
    this.client = client
  }

  signMessage (message, from) {
    return 'X'
  }
}

class Y {
  setClient (client) {
    this.client = client
  }

  signMessage (message, from) {
    const provider = this.client.getProviderForMethod('signMessage', this)
    const res = provider.signMessage(message, from)
    return 'Y' + ' ' + res
  }
}

class Z {
  setClient (client) {
    this.client = client
  }

  signMessage (message, from) {
    const provider = this.client.getProviderForMethod('signMessage', this)
    const res = provider.signMessage(message, from)
    return 'Z' + ' ' + res
  }
}

const ethereum = new ChainAbstractionLayer()
ethereum.addProvider(new Y())
ethereum.addProvider(new Z())
ethereum.addProvider(new X())

;(async () => {
  console.log(await ethereum.signMessage('hello world'))
})()
