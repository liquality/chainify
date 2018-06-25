"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Export available rpc methods.
 */
var _default2 = {
  abandonTransaction: {
    version: '>=0.12.0'
  },
  abortRescan: {
    version: '>=0.15.0'
  },
  addMultiSigAddress: {
    version: '>=0.1.0'
  },
  addNode: {
    version: '>=0.8.0'
  },
  addWitnessAddress: {
    version: '>=0.13.0'
  },
  backupWallet: {
    version: '>=0.3.12'
  },
  bumpFee: {
    version: '>=0.14.0'
  },
  clearBanned: {
    version: '>=0.12.0'
  },
  combineRawTransaction: {
    version: '>=0.15.0'
  },
  createMultiSig: {
    version: '>=0.1.0'
  },
  createRawTransaction: {
    version: '>=0.7.0'
  },
  createWitnessAddress: {
    version: '=0.13.0'
  },
  decodeRawTransaction: {
    version: '>=0.7.0'
  },
  decodeScript: {
    version: '>=0.9.0'
  },
  disconnectNode: {
    version: '>=0.12.0'
  },
  dumpPrivKey: {
    obfuscate: {
      response: function response() {
        return '******';
      }
    },
    version: '>=0.6.0'
  },
  dumpWallet: {
    version: '>=0.9.0'
  },
  encryptWallet: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)(_toConsumableArray(params), '[0]', '******');
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'passphrase', '******');
        }
      }
    },
    version: '>=0.1.0'
  },
  estimateFee: {
    version: '>=0.10.0'
  },
  estimatePriority: {
    version: '>=0.10.0 <0.15.0'
  },
  estimateSmartFee: {
    version: '>=0.12.0'
  },
  estimateSmartPriority: {
    version: '>=0.12.0 <0.15.0'
  },
  fundRawTransaction: {
    version: '>=0.12.0'
  },
  generate: {
    version: '>=0.11.0'
  },
  generateToAddress: {
    version: '>=0.13.0'
  },
  getAccount: {
    version: '>=0.1.0'
  },
  getAccountAddress: {
    version: '>=0.3.18'
  },
  getAddedNodeInfo: {
    version: '>=0.8.0'
  },
  getAddressesByAccount: {
    version: '>=0.1.0'
  },
  getBalance: {
    version: '>=0.3.18',
    formatter: {
      output: function output(number) {
        number = number || 0;
        var bn = new _bignumber.default(number);
        return bn.multipliedBy(1e8);
      }
    }
  },
  getBestBlockHash: {
    version: '>=0.9.0'
  },
  getBlock: {
    version: '>=0.6.0',
    formatter: {
      output: function output(object) {
        object = (0, _util.renameKey)(object, 'tx', 'transactions');
        object = (0, _util.renameKey)(object, 'time', 'timestamp');
        object = (0, _util.renameKey)(object, 'previousblockhash', 'parentHash');
        return object;
      }
    }
  },
  getBlockCount: {
    version: '>=0.1.0'
  },
  getBlockHash: {
    version: '>=0.6.0'
  },
  getBlockHeader: {
    version: '>=0.12.0'
  },
  getBlockTemplate: {
    version: '>=0.7.0'
  },
  getBlockchainInfo: {
    version: '>=0.9.2'
  },
  getChainTips: {
    version: '>=0.10.0'
  },
  getChainTxStats: {
    version: '>=0.15.0'
  },
  getConnectionCount: {
    version: '>=0.1.0'
  },
  getDifficulty: {
    version: '>=0.1.0'
  },
  getGenerate: {
    version: '<0.13.0'
  },
  getHashesPerSec: {
    version: '<0.10.0'
  },
  getInfo: {
    version: '>=0.1.0'
  },
  getMemoryInfo: {
    version: '>=0.14.0'
  },
  getMempoolAncestors: {
    version: '>=0.13.0'
  },
  getMempoolDescendants: {
    version: '>=0.13.0'
  },
  getMempoolEntry: {
    version: '>=0.13.0'
  },
  getMempoolInfo: {
    version: '>=0.10.0'
  },
  getMiningInfo: {
    version: '>=0.6.0'
  },
  getNetTotals: {
    version: '>=0.1.0'
  },
  getNetworkHashPs: {
    version: '>=0.9.0'
  },
  getNetworkInfo: {
    version: '>=0.9.2'
  },
  getNewAddress: {
    version: '>=0.1.0'
  },
  getPeerInfo: {
    version: '>=0.7.0'
  },
  getRawChangeAddress: {
    version: '>=0.9.0'
  },
  getRawMempool: {
    version: '>=0.7.0'
  },
  getRawTransaction: {
    version: '>=0.7.0'
  },
  getReceivedByAccount: {
    version: '>=0.1.0'
  },
  getReceivedByAddress: {
    version: '>=0.1.0'
  },
  getTransaction: {
    version: '>=0.1.0'
  },
  getTxOut: {
    version: '>=0.7.0'
  },
  getTxOutProof: {
    version: '>=0.11.0'
  },
  getTxOutSetInfo: {
    version: '>=0.7.0'
  },
  getUnconfirmedBalance: {
    version: '>=0.9.0'
  },
  getWalletInfo: {
    version: '>=0.9.2'
  },
  getWork: {
    version: '<0.10.0'
  },
  help: {
    version: '>=0.1.0'
  },
  importAddress: {
    version: '>=0.10.0'
  },
  importMulti: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)(params, '[0]', (0, _lodash.map)(params[0], function (request) {
            return (0, _lodash.set)(request, 'keys', (0, _lodash.map)(request.keys, function () {
              return '******';
            }));
          }));
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'requests', (0, _lodash.map)(params.requests, function (request) {
            return (0, _lodash.set)(request, 'keys', (0, _lodash.map)(request.keys, function () {
              return '******';
            }));
          }));
        }
      }
    },
    version: '>=0.14.0'
  },
  importPrivKey: {
    obfuscate: {
      request: {
        default: function _default() {
          return ['******'];
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'privkey', '******');
        }
      }
    },
    version: '>=0.6.0'
  },
  importPrunedFunds: {
    version: '>=0.13.0'
  },
  importPubKey: {
    version: '>=0.12.0'
  },
  importWallet: {
    version: '>=0.9.0'
  },
  keypoolRefill: {
    version: '>=0.1.0'
  },
  listAccounts: {
    version: '>=0.1.0'
  },
  listAddressGroupings: {
    version: '>=0.7.0'
  },
  listBanned: {
    version: '>=0.12.0'
  },
  listLockUnspent: {
    version: '>=0.8.0'
  },
  listReceivedByAccount: {
    version: '>=0.1.0'
  },
  listReceivedByAddress: {
    version: '>=0.1.0'
  },
  listSinceBlock: {
    version: '>=0.5.0'
  },
  listTransactions: {
    version: '>=0.3.18'
  },
  listUnspent: {
    version: '>=0.7.0'
  },
  listWallets: {
    version: '>=0.15.0'
  },
  lockUnspent: {
    version: '>=0.8.0'
  },
  move: {
    version: '>=0.3.18'
  },
  ping: {
    version: '>=0.9.0'
  },
  preciousBlock: {
    version: '>=0.14.0'
  },
  prioritiseTransaction: {
    version: '>=0.10.0'
  },
  pruneBlockchain: {
    version: '>=0.14.0'
  },
  removePrunedFunds: {
    version: '>=0.13.0'
  },
  sendFrom: {
    version: '>=0.3.18'
  },
  sendMany: {
    version: '>=0.3.21'
  },
  sendRawTransaction: {
    version: '>=0.7.0'
  },
  sendToAddress: {
    version: '>=0.1.0'
  },
  setAccount: {
    version: '>=0.1.0'
  },
  setBan: {
    version: '>=0.12.0'
  },
  setGenerate: {
    version: '<0.13.0'
  },
  setNetworkActive: {
    version: '>=0.14.0'
  },
  setTxFee: {
    version: '>=0.3.22'
  },
  signMessage: {
    version: '>=0.5.0'
  },
  signMessageWithPrivKey: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)(_toConsumableArray(params), '[0]', '******');
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'privkey', '******');
        }
      }
    },
    version: '>=0.13.0'
  },
  signRawTransaction: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)(_toConsumableArray(params), '[2]', (0, _lodash.map)(params[2], function () {
            return '******';
          }));
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'privkeys', (0, _lodash.map)(params.privkeys || [], function () {
            return '******';
          }));
        }
      }
    },
    version: '>=0.7.0'
  },
  stop: {
    version: '>=0.1.0'
  },
  submitBlock: {
    version: '>=0.7.0'
  },
  upTime: {
    version: '>=0.15.0'
  },
  validateAddress: {
    version: '>=0.3.14'
  },
  verifyChain: {
    version: '>=0.9.0'
  },
  verifyMessage: {
    version: '>=0.5.0'
  },
  verifyTxOutProof: {
    version: '>0.11.0'
  },
  walletLock: {
    version: '>=0.1.0'
  },
  walletPassphrase: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)(_toConsumableArray(params), '[0]', '******');
        },
        named: function named(params) {
          return (0, _lodash.set)(params, 'passphrase', '******');
        }
      }
    },
    version: '>=0.1.0'
  },
  walletPassphraseChange: {
    obfuscate: {
      request: {
        default: function _default(params) {
          return (0, _lodash.set)((0, _lodash.set)(_toConsumableArray(params), '[0]', '******'), '[1]', '******');
        },
        named: function named(params) {
          return (0, _lodash.set)((0, _lodash.set)(params, 'oldpassphrase', '******'), 'newpassphrase', '******');
        }
      }
    },
    version: '>=0.1.0'
  },
  getAddressBalance: {
    version: '>=0.1.0'
  },
  getAddressUtxos: {
    version: '>=0.1.0'
  },
  getBlockByNumber: {
    version: '>=0.6.0',
    custom: true,
    function: {
      run: function () {
        var _run = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(_this, params) {
          var data, txFull, hash, blockData, _params;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _params = _slicedToArray(params, 2);
                  data = _params[0];
                  txFull = _params[1];
                  _context.next = 5;
                  return _this.getBlockHash(data);

                case 5:
                  hash = _context.sent;
                  _context.next = 8;
                  return getBlockData(_this, hash, txFull);

                case 8:
                  blockData = _context.sent;
                  return _context.abrupt("return", blockData);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function run(_x, _x2) {
          return _run.apply(this, arguments);
        };
      }()
    }
  },
  getBlockByHash: {
    version: '>=0.6.0',
    custom: true,
    function: {
      run: function () {
        var _run2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(_this, params) {
          var data, txFull, blockData, _params2;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _params2 = _slicedToArray(params, 2);
                  data = _params2[0];
                  txFull = _params2[1];
                  _context2.next = 5;
                  return getBlockData(_this, data, txFull);

                case 5:
                  blockData = _context2.sent;
                  return _context2.abrupt("return", blockData);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function run(_x3, _x4) {
          return _run2.apply(this, arguments);
        };
      }()
    }
  }
};
exports.default = _default2;

var getBlockData =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_this, hash, txFull) {
    var blockData, transactions;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _this.getBlock(hash);

          case 2:
            blockData = _context4.sent;

            if (!txFull) {
              _context4.next = 11;
              break;
            }

            transactions = [];
            _context4.next = 7;
            return (0, _util.asyncForEach)(blockData.transactions,
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3(txid) {
                var transaction;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _this.getTransaction(txid);

                      case 2:
                        transaction = _context3.sent;
                        transactions.push(transaction);

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 7:
            blockData.transactions = transactions;
            return _context4.abrupt("return", blockData);

          case 11:
            return _context4.abrupt("return", blockData);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getBlockData(_x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();