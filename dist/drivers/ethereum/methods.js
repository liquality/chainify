"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-inline-comments */

/**
 * Module dependencies.
 */
// import { map, set } from 'lodash'
const isBigNumber = function (object) {
  return object instanceof _bignumber.default || object && object.constructor && object.constructor.name === 'BigNumber';
};

const isString = function (object) {
  return typeof object === 'string' || object && object.constructor && object.constructor.name === 'String';
};
/**
 * Export available rpc methods.
 */


var _default = {
  eth_getBalance: {
    formatter: {
      output(number) {
        number = number || 0;

        if (isBigNumber(number)) {
          return number;
        }

        if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
          return new _bignumber.default(number.replace('0x', ''), 16);
        }

        return new _bignumber.default(number.toString(10), 10);
      }

    }
  }
};
exports.default = _default;