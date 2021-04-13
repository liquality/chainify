import _debug from 'debug'
import { version } from '../package.json'

const FORMAT_ARGS_BACKUP_KEY = '__formatArgs'
// TODO: types?
const debug: any = _debug

if (!debug[FORMAT_ARGS_BACKUP_KEY]) {
  debug[FORMAT_ARGS_BACKUP_KEY] = debug.formatArgs
}

debug.formatArgs = function (args: any[]) {
  const log: any = {
    args: args.concat([]),
    namespace: this.namespace,
    diff: debug.humanize(this.diff),
    time: new Date().toISOString()
  }

  try {
    throw new Error('')
  } catch (error) {
    log.stack = error.stack.split('\n')

    log.stack.shift()
    log.stack.shift()
    log.stack.shift()

    log.stack = log.stack.map((trace: any) => trace.trim())
  }

  if (!(console as any).history) {
    ;(console as any).history = [`@liquality/debug v${version}`]
  }

  ;(console as any).history.push(log)

  debug[FORMAT_ARGS_BACKUP_KEY].call(this, args)
}

const Debug = (namespace: string) => {
  namespace = `liquality:cal:${namespace}`
  return debug(namespace)
}

export default Debug
