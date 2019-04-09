import debug from 'debug'
debug.inspectOpts.colors = false

export default (namespace, type = 'log') => {
  namespace = `liquality:cal:${namespace}`
  const obj = debug(namespace)

  obj.log = (...args) => {
    const arr = args[0].split(' ')
    const time = arr.shift()
    arr.shift() // remove namespace
    args[0] = arr.join(' ')

    let stack = false

    try {
      throw Error('')
    } catch (error) {
      stack = error.stack.split('\n')

      stack.shift()
      stack.shift()
      stack.shift()

      stack = stack.map(trace => trace.trim())
    }

    if (!console.history) {
      console.history = []
    }

    console.history.push({
      type,
      time,
      namespace,
      args,
      stack
    })

    console[type].apply(console, args)
  }

  return obj
}
