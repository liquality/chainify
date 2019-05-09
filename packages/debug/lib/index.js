import debug from 'debug'
import { version } from '../package.json'

const FORMAT_ARGS_BACKUP_KEY = '__formatArgs'

if (!debug[FORMAT_ARGS_BACKUP_KEY]) {
  debug[FORMAT_ARGS_BACKUP_KEY] = debug.formatArgs
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
      `@liquality/debug v${version}`
    ]
  }

  console.history.push(log)

  debug[FORMAT_ARGS_BACKUP_KEY].call(this, args)
}

const Debug = (namespace) => {
  namespace = `liquality:cal:${namespace}`
  return debug(namespace)
}

Debug.version = version

export default Debug
