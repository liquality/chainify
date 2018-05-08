"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/**
 * Module dependencies.
 */

/**
 * Export Requester class.
 */
class Requester {
  constructor({
    driver,
    unsupported = [],
    version
  } = {}) {
    this.driver = driver;
    this.unsupported = unsupported;
    this.version = version;
  }
  /**
  * Prepare rpc request.
  */


  prepare({
    method,
    params = [],
    suffix
  }) {
    if (this.version && (0, _lodash.includes)(this.unsupported, method)) {
      throw new Error(`Method "${method}" is not supported by version "${this.version}"`);
    }

    const formatted = this.driver.formatter.request(method, params, suffix);
    return {
      id: `${Date.now()}${formatted.suffix !== undefined ? `-${formatted.suffix}` : ''}`,
      method: formatted.method,
      params: formatted.params
    };
  }

}

exports.default = Requester;