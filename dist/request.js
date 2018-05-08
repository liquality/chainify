"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _requestObfuscator=_interopRequireDefault(require("./logging/request-obfuscator")),_request=_interopRequireDefault(require("request")),_requestLogger=_interopRequireDefault(require("@uphold/request-logger"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var _default=(a,b)=>{const c=new _requestObfuscator.default(a);return(0,_requestLogger.default)(_request.default,(a,d)=>(c.obfuscate(a,d),"response"===a.type?b.debug({request:a},`Received response for request ${a.id}`):b.debug({request:a},`Making request ${a.id} to ${a.method} ${a.uri}`)))};exports.default=_default;