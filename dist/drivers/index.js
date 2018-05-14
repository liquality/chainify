"use strict";

var _bitcoin = _interopRequireDefault(require("./bitcoin"));

var _ethereum = _interopRequireDefault(require("./ethereum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  bitcoin: _bitcoin.default,
  ethereum: _ethereum.default
};