var regeneratorRuntime = require('regenerator-runtime');


import DNSParser from 'dsn-parser';
import BaseError from 'standard-error';
import JSONBigInt from 'json-bigint';
import _, { get, has, includes } from 'lodash';
import semver from 'semver';
import Promise$1 from 'bluebird';

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

var DNSParser$1 = (function (uri) {
  var dsn = new DNSParser(uri);

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

  var baseUrl = defaultProtocol + '://' + host + ':' + (port || defaultPort);
  var auth = (password || user) && { pass: password, user: user };

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
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Export `StandardError` class.
 */

var StandardError = function (_BaseError) {
  _inherits(StandardError, _BaseError);

  function StandardError() {
    _classCallCheck(this, StandardError);

    return _possibleConstructorReturn(this, (StandardError.__proto__ || Object.getPrototypeOf(StandardError)).apply(this, arguments));
  }

  return StandardError;
}(BaseError);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Export `RpcError` class.
 */

var RpcError = function (_StandardError) {
  _inherits$1(RpcError, _StandardError);

  function RpcError(code, msg) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck$1(this, RpcError);

    if (typeof code !== 'number') {
      throw new TypeError('Non-numeric HTTP code');
    }

    if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object' && msg !== null) {
      props = msg;
      msg = null;
    }

    props.code = code;

    return _possibleConstructorReturn$1(this, (RpcError.__proto__ || Object.getPrototypeOf(RpcError)).call(this, msg || code, props));
  }

  _createClass(RpcError, [{
    key: 'toString',
    value: function toString() {
      return this.name + ': ' + this.code + ' ' + this.message;
    }
  }, {
    key: 'status',
    get: function get$$1() {
      return this.code;
    },
    set: function set(value) {
      Object.defineProperty(this, 'status', {
        configurable: true,
        enumerable: true,
        value: value,
        writable: true
      });
    }
  }]);

  return RpcError;
}(StandardError);

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _JSONBigInt = JSONBigInt({ storeAsString: true, strict: true }),
    parse = _JSONBigInt.parse; // eslint-disable-line new-cap

var JsonRpcHelper = function () {
  function JsonRpcHelper() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$unsupported = _ref.unsupported,
        unsupported = _ref$unsupported === undefined ? [] : _ref$unsupported,
        version = _ref.version;

    _classCallCheck$2(this, JsonRpcHelper);

    this.unsupported = unsupported;
    this.version = version;
  }

  _createClass$1(JsonRpcHelper, [{
    key: 'prepareRequest',
    value: function prepareRequest(_ref2) {
      var method = _ref2.method,
          _ref2$params = _ref2.params,
          params = _ref2$params === undefined ? [] : _ref2$params,
          suffix = _ref2.suffix;

      if (this.version && includes(this.unsupported, method)) {
        throw new Error('Method "' + method + '" is not supported by version "' + this.version + '"');
      }

      return JSON.stringify({
        id: '' + Date.now() + (suffix !== undefined ? '-' + suffix : ''),
        method: method,
        params: params
      });
    }
  }, {
    key: 'parseResponse',
    value: function parseResponse(response) {
      // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
      // when an error occurs.
      if (typeof response.body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
        throw new RpcError(response.statusCode, response.statusMessage, { body: response.body });
      }

      // Parsing the body with custom parser to support BigNumbers.
      response.body = parse(response.body);

      return this.getRpcResult(response);
    }
  }, {
    key: 'getRpcResult',
    value: function getRpcResult(_ref3) {
      var body = _ref3.body;

      if (body.error) {
        throw new RpcError(get(body, 'error.code', -32603), get(body, 'error.message', 'An error occurred while processing the RPC call'));
      }

      // Defensive measure. This should not happen on a RPC call.
      if (!has(body, 'result')) {
        throw new RpcError(-32700, 'Missing `result` on the RPC call result');
      }

      return body.result;
    }
  }]);

  return JsonRpcHelper;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
  function Provider() {
    _classCallCheck$3(this, Provider);
  }

  _createClass$2(Provider, [{
    key: 'methods',
    value: function methods() {
      return ['getBlockByNumber'
      // 'getBlockByHash',
      // 'getBlockHeight',
      // 'getBlockHash',
      // 'getAddress',
      // 'signMessage'
      ];
    }
  }]);

  return Provider;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * BitcoinProvider class
 * with bitcoin related transforms
 */

var BitcoinProvider$1 = function () {
  function BitcoinProvider() {
    _classCallCheck$4(this, BitcoinProvider);
  }

  _createClass$3(BitcoinProvider, [{
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'transforms',
    value: function transforms() {
      return {
        methodToRpc: function methodToRpc(method, params) {
          return method.toLowerCase();
        },
        value: function value(val, unit) {
          // convert hex to satoshi/mBTC/BTC
          return val;
        }
      };
    }
  }]);

  return BitcoinProvider;
}();


BitcoinProvider$1.Types = {
  Block: {
    number: 'height',
    hash: 'hash',
    timestamp: 'time',
    difficulty: 'difficulty',
    size: 'size',
    parentHash: 'previousblockhash',
    nonce: 'nonce',
    transactions: 'tx',
    exampleComputedValue: function exampleComputedValue(key, result) {
      return result.tx.reduce(function (value, tx) {
        return value + tx.amount;
      }, 0);
    }
  },
  Transaction: {
    confirmations: 'confirmations',
    hash: 'txid',
    value: 'amount',
    blockHash: 'blockHash',
    blockNumber: 'blockNumber'
  }
};

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockProvider = function (_BitcoinProvider) {
  _inherits$2(BlockProvider, _BitcoinProvider);

  function BlockProvider() {
    _classCallCheck$5(this, BlockProvider);

    return _possibleConstructorReturn$2(this, (BlockProvider.__proto__ || Object.getPrototypeOf(BlockProvider)).apply(this, arguments));
  }

  _createClass$4(BlockProvider, [{
    key: 'methods',
    value: function methods() {
      var _this2 = this;

      var client = this.client;


      return {
        getTransactionByHash: {
          version: '>=0.0.0',
          handle: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var tx, txd, obj;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return client.rpc.apply(client, ['gettransaction'].concat(_toConsumableArray(args)));

                    case 2:
                      tx = _context.sent;
                      _context.next = 5;
                      return client.rpc('decoderawtransaction', tx.hex);

                    case 5:
                      txd = _context.sent;
                      obj = Object.assign({}, tx, txd);
                      return _context.abrupt('return', obj);

                    case 8:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this2);
            }));

            function handle() {
              return _ref.apply(this, arguments);
            }

            return handle;
          }(),
          mapping: BitcoinProvider$1.Types.Transaction
        },

        getBlock: {
          version: '>=0.6.0',
          transform: {
            confirmations: function confirmations(_confirmations) {
              // transform
              if (_confirmations > 100) return 'Enough';else return 'Wait';
            },
            tx: [function transform(value) {
              return 'Tx<' + value + '>';
            }]
          },
          mapping: BitcoinProvider$1.Types.Block,
          type: 'Block'
        },

        getBlockByNumber: {
          version: '>=0.6.0',
          handle: 'getblockhash|getblock', // pipe rpc methods
          transform: {
            confirmations: function confirmations(_confirmations2) {
              // transform
              if (_confirmations2 > 100) return 'Enough';else return 'Wait';
            },
            tx: [{
              handle: 'gettransaction' // populate all tx
            }]
          },
          mapping: BitcoinProvider$1.Types.Block,
          type: 'Block'
        },

        getBlockByHash: {
          version: '>=0.6.0',
          alias: 'getBlock', // alias object methods
          mapping: BitcoinProvider$1.Types.Block,
          type: 'Block'
        },

        getBlockHeight: {
          version: '>=0.1.0',
          handle: 'getblockcount' // custom object method mapped to rpc method
        },

        getBlockHash: {
          version: '>=0.6.0'
        },

        getBlockHeader: {
          version: '>=0.12.0'
        }
      };
    }
  }]);

  return BlockProvider;
}(BitcoinProvider$1);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transport = require('@ledgerhq/hw-transport-node-hid').default;
var LedgerBtc = require('@ledgerhq/hw-app-btc').default;

var LedgerWalletProvider = function (_BitcoinProvider) {
  _inherits$3(LedgerWalletProvider, _BitcoinProvider);

  function LedgerWalletProvider() {
    _classCallCheck$6(this, LedgerWalletProvider);

    return _possibleConstructorReturn$3(this, (LedgerWalletProvider.__proto__ || Object.getPrototypeOf(LedgerWalletProvider)).apply(this, arguments));
  }

  _createClass$5(LedgerWalletProvider, [{
    key: 'methods',
    value: function methods() {
      var _this2 = this;

      var connectToLedger = function () {
        var _ref = _asyncToGenerator$1( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var transport;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (ledgerBtc) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 3;
                  return Transport.create();

                case 3:
                  transport = _context.sent;

                  ledgerBtc = new LedgerBtc(transport);

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function connectToLedger() {
          return _ref.apply(this, arguments);
        };
      }();

      var ledgerBtc = false;

      return {
        getAddress: {
          handle: function () {
            var _ref2 = _asyncToGenerator$1( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return connectToLedger();

                    case 2:
                      return _context2.abrupt('return', ledgerBtc.getWalletPublicKey('44\'/0\'/0\'/0').bitcoinAddress);

                    case 3:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this2);
            }));

            function handle() {
              return _ref2.apply(this, arguments);
            }

            return handle;
          }()
        },
        signMessage: {
          handle: function () {
            var _ref3 = _asyncToGenerator$1( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var _args3, message;

              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return connectToLedger();

                    case 2:
                      _args3 = _slicedToArray(args, 1), message = _args3[0];
                      return _context3.abrupt('return', ledgerBtc.signMessageNew('44\'/0\'/0\'/0', Buffer.from(message).toString('hex')));

                    case 4:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this2);
            }));

            function handle() {
              return _ref3.apply(this, arguments);
            }

            return handle;
          }()
        }
      };
    }
  }]);

  return LedgerWalletProvider;
}(BitcoinProvider$1);

var bitcoin = [new BlockProvider(), new LedgerWalletProvider()];

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * EthereumProvider class
 * with ethereum related transforms
 */

var EthereumProvider = function () {
  function EthereumProvider() {
    _classCallCheck$7(this, EthereumProvider);
  }

  _createClass$6(EthereumProvider, [{
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'transforms',
    value: function transforms() {
      return {
        methodToRpc: function methodToRpc(method, params) {
          return method;
        },
        value: function value(val, unit) {
          // convert hex to satoshi/mBTC/BTC
          return val;
        }
      };
    }
  }]);

  return EthereumProvider;
}();


BitcoinProvider.Types = {
  Block: {
    number: 'number',
    hash: 'hash',
    timestamp: 'time',
    difficulty: 'difficulty',
    size: 'size',
    parentHash: 'parentHash',
    nonce: 'nonce',
    transactions: 'transactions'
  },
  Transaction: {
    confirmations: function confirmations(key, result, client) {
      return client.rpc('eth_blockNumber').then(function (currentBlock) {
        return Number(currentBlock) - result[key];
      });
    },
    hash: 'hash',
    value: 'value',
    blockHash: 'blockHash',
    blockNumber: 'blockNumber'
  }
};

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockProvider$1 = function (_EthereumProvider) {
  _inherits$4(BlockProvider, _EthereumProvider);

  function BlockProvider() {
    _classCallCheck$8(this, BlockProvider);

    return _possibleConstructorReturn$4(this, (BlockProvider.__proto__ || Object.getPrototypeOf(BlockProvider)).apply(this, arguments));
  }

  _createClass$7(BlockProvider, [{
    key: 'methods',
    value: function methods() {
      var client = this.client;


      return {
        getBlockByNumber: {
          handle: function handle() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return client.rpc.apply(client, ['eth_getBlockByNumber'].concat(args, [false]));
          },
          mapping: EthereumProvider.Types.Block
        },
        getTransactionByHash: {
          mapping: EthereumProvider.Types.Transaction
        }
      };
    }
  }]);

  return BlockProvider;
}(EthereumProvider);

var ethereum = [new BlockProvider$1()];

var providers = {
  bitcoin: bitcoin,
  ethereum: ethereum
};

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator$2(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise$1(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise$1.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// DEV: hack
var request = require('request-promise');

var Client = function () {
  function Client(uri) {
    var _this = this;

    _classCallCheck$9(this, Client);

    var _DNSParser = DNSParser$1(uri),
        baseUrl = _DNSParser.baseUrl,
        driverName = _DNSParser.driverName,
        timeout = _DNSParser.timeout,
        returnHeaders = _DNSParser.returnHeaders,
        strictSSL = _DNSParser.strictSSL,
        auth = _DNSParser.auth,
        version = _DNSParser.version;

    this.transforms = {
      methodToRpc: function methodToRpc(method) {
        return method.toLowerCase();
      },
      value: function value(val, unit) {
        return val;
      }
    };

    this.methods = {};

    // unused. remove later
    this.rpcMethods = {};

    this.chainName = driverName;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.returnHeaders = returnHeaders;
    this.strictSSL = strictSSL;
    this.auth = auth;
    this.version = version;

    this.jsonRpcHelper = new JsonRpcHelper({ version: version });
    this.request = request.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout,
      resolveWithFullResponse: true
    });

    // load default providers
    if (providers[driverName]) {
      providers[driverName].forEach(function (provider) {
        return _this.addProvider(provider);
      });
    }

    var provider = new Provider();
    provider.methods().forEach(function (method) {
      if (!_.isFunction(_this[method])) {
        throw new Error('Implement ' + method + ' method');
      }
    });
  }

  _createClass$8(Client, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      var _this2 = this;

      provider.setClient(this);

      _.forOwn(provider.transforms(), function (fn, transform) {
        _this2.transforms[transform] = fn;
      });

      var methods = provider.methods();

      if (this.version) {
        var result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(this.version);

        if (!result) {
          throw new Error('Invalid version "' + this.version + '"', { version: this.version });
        }

        var _result = _slicedToArray$1(result, 1),
            version = _result[0];

        this.unsupportedMethods = _.chain(methods).pickBy(function (method) {
          return !semver.satisfies(version, method.version);
        }).keys().value();
      }

      _.forOwn(provider.methods(), function (obj, method) {
        _this2.methods[method] = obj;

        if (obj.handle) {
          if (_.isFunction(obj.handle)) {
            // this[method] = _.partial(obj.handle)
            _this2[method] = _.partial(_this2.methodWrapper, method, obj.handle);
          } else {
            _this2[method] = _.partial(_this2.rpcWrapper, method, obj.handle);
          }
        } else {
          var rpcMethod = _this2.getRpcMethod(method, obj);

          if (!_this2.rpcMethods[rpcMethod]) _this2.rpcMethods[rpcMethod] = obj;
          _this2[method] = _.partial(_this2.rpcWrapper, method, rpcMethod);
        }
      });
    }
  }, {
    key: 'getRpcMethod',
    value: function getRpcMethod(method, obj) {
      if (obj.alias) {
        return this.getRpcMethod(obj.alias, this.methods[obj.alias]);
      } else {
        return this.transforms.methodToRpc(method);
      }
    }
  }, {
    key: 'handleTransformation',
    value: function handleTransformation(transformation, result) {
      var _this3 = this;

      if (_.isFunction(transformation)) {
        return Promise$1.resolve(transformation(result));
      } else if (transformation.handle) {
        return this.rpc(transformation.handle, result);
      } else if (_.isArray(transformation)) {
        var _transformation = _slicedToArray$1(transformation, 1),
            obj = _transformation[0];

        return Promise$1.map(result, function (param) {
          return _this3.handleTransformation(obj, param);
        });
      } else {
        return Promise$1.reject(new Error('This type of mapping is not implemented yet.'));
      }
    }
  }, {
    key: 'handleResponse',
    value: function handleResponse(response, method) {
      var _this4 = this;

      var ref = this;
      return Promise$1.resolve(function () {
        var transform = ref.methods[method].transform;


        if (transform) {
          return Promise$1.map(Object.keys(transform), function (field) {
            return ref.handleTransformation(transform[field], response[field]).then(function (transformedField) {
              response[field] = transformedField;
            });
          }).then(function (__) {
            return response;
          });
        } else {
          return response;
        }
      }()).then(function (result) {
        var _ref$methods$method = ref.methods[method],
            mapping = _ref$methods$method.mapping,
            type = _ref$methods$method.type;


        if (mapping) {
          Object.keys(mapping).forEach(function () {
            var _ref = _asyncToGenerator$2( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key) {
              var t;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      t = mapping[key];

                      if (!(typeof t === 'string')) {
                        _context.next = 5;
                        break;
                      }

                      result[key] = result[t];
                      _context.next = 12;
                      break;

                    case 5:
                      if (!_.isFunction(t)) {
                        _context.next = 11;
                        break;
                      }

                      _context.next = 8;
                      return t(key, result, ref);

                    case 8:
                      result[key] = _context.sent;
                      _context.next = 12;
                      break;

                    case 11:
                      throw new Error('This type of mapping is not implemented yet.');

                    case 12:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this4);
            }));

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        }

        if (type) {
          var _interface = Client.Types[type];

          if (!_interface) {
            throw new Error('Unknown type ' + type);
          }

          Object.keys(_interface).forEach(function (key) {
            if (result[key] === undefined) {
              throw new Error('Method did not return ' + key + '. ' + JSON.stringify(result));
            }
          });
        }

        return result;
      });
    }
  }, {
    key: 'methodWrapper',
    value: function methodWrapper(method, fn) {
      var _this5 = this;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return Promise$1.resolve(fn.apply(undefined, args)).then(function (x) {
        return _this5.handleResponse(x, method);
      });
    }
  }, {
    key: 'rpcWrapper',
    value: function rpcWrapper(method, rpcMethod) {
      var _this6 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      return this.rpc.apply(this, [rpcMethod].concat(args)).then(function (x) {
        return _this6.handleResponse(x, method);
      });
    }
  }, {
    key: 'rpc',
    value: function rpc(_method) {
      var _this7 = this;

      var methods = _method.split('|');

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return Promise$1.reduce(methods, function (params, method) {
        if (!_.isArray(params)) params = [params];

        var requestBody = _this7.jsonRpcHelper.prepareRequest({ method: method, params: params });

        return _this7.request.post({
          auth: _.pickBy(_this7.auth, _.identity),
          body: requestBody,
          uri: '/'
        }).then(_this7.jsonRpcHelper.parseResponse.bind(_this7.jsonRpcHelper));
      }, args);
    }
  }, {
    key: 'wire',
    value: function wire(_method) {
      throw new Error('Method not implemented yet');
    }
  }]);

  return Client;
}();


Client.providers = providers;
Client.Types = {
  Block: {
    number: 'number',
    hash: 'string',
    timestamp: 'timestamp',
    difficulty: 'number',
    size: 'number',
    parentHash: 'string',
    nonce: 'number'
  }
};

export default Client;
