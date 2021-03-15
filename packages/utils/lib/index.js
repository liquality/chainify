function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function asyncSetImmediate () {
  return new Promise(resolve => setImmediate(resolve))
}

function caseInsensitiveEqual (left: string, right: string) {
  left = left && left.toLowerCase()
  right = right && right.toLowerCase()

  return left === right
}

export {
  sleep,
  asyncSetImmediate,
  caseInsensitiveEqual
}
