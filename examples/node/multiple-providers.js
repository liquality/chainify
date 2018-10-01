const { Client, Provider } = require('../../')

class X extends Provider {
  signMessage (message, from) {
    return message + ' X'
  }
}

class Y extends Provider {
  signMessage (message, from) {
    return this.getMethod('signMessage')(message, from) + ' Y'
  }
}

class Z extends Provider {
  signMessage (message, from) {
    return this.getMethod('signMessage')(message, from) + ' Z'
  }
}

const client = new Client()
client.addProvider(new X())
  .addProvider(new Y())
  .addProvider(new Z())

;(async () => {
  try {
    console.log(await client.signMessage('hello world'))
  } catch (e) {
    console.error(e)
  }
})()
