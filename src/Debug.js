import debug from 'debug'
debug.useColors = () => false

function isBrowser () {
  return typeof process === 'undefined' ||
         process.type === 'renderer' ||
         process.browser === true ||
         process.__nwjs
}

export default (namespace, type = 'log') => {
  namespace = `liquality:cal:${namespace}`
  const obj = debug(namespace)

  obj.log = (...args) => {
    const arr = args[0].split(' ')
    const arg0 = arr[isBrowser() ? 1 : 2]

    args.shift()
    args = [ arg0, ...args ]

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
      time: new Date().toISOString(),
      namespace,
      args,
      stack
    })

    /* eslint-disable-next-line no-useless-call */
    console[type].apply(console, [ namespace, ...args ])
  }

  return obj
}
