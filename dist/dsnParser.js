"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dsnParser = _interopRequireDefault(require("dsn-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Secure driver connection postfix and checker
 * Ref - https://tools.ietf.org/html/rfc3986#section-3.1
 */
var SECURE_DRIVER_POSTFIX = '+s';

var shouldUseHTTPS = function shouldUseHTTPS(driver) {
  return driver.endsWith(SECURE_DRIVER_POSTFIX);
};

var getSecureDriverName = function getSecureDriverName(driver) {
  return driver.substring(0, driver.length - SECURE_DRIVER_POSTFIX.length);
};

var _default = function _default(uri) {
  var dsn = new _dsnParser.default(uri);

  var _dsn$getParts = dsn.getParts(),
      driver = _dsn$getParts.driver,
      user = _dsn$getParts.user,
      password = _dsn$getParts.password,
      host = _dsn$getParts.host,
      port = _dsn$getParts.port,
      params = _dsn$getParts.params;

  var timeout = params.timeout,
      returnHeaders = params.returnHeaders,
      strictSSL = params.strictSSL,
      loggerName = params.loggerName,
      version = params.version;
  var defaultProtocol = 'http';
  var defaultPort = 80;
  var driverName = driver;
  timeout = timeout ? Number(timeout) : undefined;
  returnHeaders = returnHeaders === 'true';
  strictSSL = strictSSL === 'true';
  loggerName = loggerName || driver;

  if (shouldUseHTTPS(driver)) {
    defaultProtocol = 'https';
    defaultPort = 443;
    driverName = getSecureDriverName(driver);
  }

  var baseUrl = "".concat(defaultProtocol, "://").concat(host, ":").concat(port || defaultPort);
  var auth = (password || user) && {
    pass: password,
    user: user
  };
  return {
    baseUrl: baseUrl,
    loggerName: loggerName,
    driverName: driverName,
    timeout: timeout,
    returnHeaders: returnHeaders,
    strictSSL: strictSSL,
    auth: auth,
    version: version
  };
};

exports.default = _default;