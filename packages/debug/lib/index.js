import debug from 'debug'
import { version } from '../package.json'

if (!debug._formatArgs) {
  debug._formatArgs = debug.formatArgs
}

debug.formatArgs = function (args) {
  const log = {
    args: args.concat([]),
    namespace: this.namespace,
    diff: debug.humanize(this.diff),
    time: new Date().toISOString()
  }

  try {
    throw Error('')
  } catch (error) {
    log.stack = error.stack.split('\n')

    log.stack.shift()
    log.stack.shift()
    log.stack.shift()

    log.stack = log.stack.map(trace => trace.trim())
  }

  if (!console.history) {
    console.history = [
      `@liquality/chainabstractionlayer v${version}`
    ]
  }

  console.history.push(log)

  debug._formatArgs.call(this, args)
}

export default (namespace) => {
  namespace = `liquality:cal:${namespace}`
  return debug(namespace)
}
