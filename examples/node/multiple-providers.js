const { Client, Provider } = require('../../')

class X extends Provider {
  signMessage (message, from) {
    return 'X'
  }
}

class Y extends Provider {
  signMessage (message, from) {
    return 'Y ' + this.getMethod('signMessage')(message, from)
  }
}

class Z extends Provider {
  signMessage (message, from) {
    return 'Z ' + this.getMethod('signMessage')(message, from)
  }
}

const client = new Client()
client.addProvider(new X())
  .addProvider(new Y())
  .addProvider(new Z())

;(async () => {
  console.log(await client.signMessage('hello world'))
})()
