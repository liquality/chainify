import DNSParser from 'dsn-parser'

const SECURE_DRIVER_POSTFIX = '+s'
const shouldUseHTTPS = (driver) => driver.endsWith(SECURE_DRIVER_POSTFIX)
const getSecureDriverName = (driver) => driver.substring(0, driver.length - SECURE_DRIVER_POSTFIX.length)

/**
 * Secure driver connection postfix and checker
 * Ref - https://tools.ietf.org/html/rfc3986#section-3.1
 */
export default (uri) => {
  const dsn = new DNSParser(uri)

  let {
    driver,
    user,
    password,
    host,
    port,
    params
  } = dsn.getParts()

  let {
    timeout,
    returnHeaders,
    strictSSL,
    loggerName,
    version
  } = params

  let defaultProtocol = 'http'
  let defaultPort = 80
  let driverName = driver

  timeout = timeout ? Number(timeout) : undefined
  returnHeaders = returnHeaders === 'true'
  strictSSL = strictSSL === 'true'
  loggerName = loggerName || driver

  if (shouldUseHTTPS(driver)) {
    defaultProtocol = 'https'
    defaultPort = 443
    driverName = getSecureDriverName(driver)
  }

  const baseUrl = `${defaultProtocol}://${host}:${port || defaultPort}`
  const auth = (password || user) && { password: password, username: user }

  return {
    baseUrl,
    loggerName,
    driverName,
    timeout,
    returnHeaders,
    strictSSL,
    auth,
    version
  }
}
