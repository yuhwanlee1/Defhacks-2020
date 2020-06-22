'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOrchestration = exports.buildReturnObject = exports.setMediatorUrn = exports.urn = void 0;

var _urijs = _interopRequireDefault(require("urijs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let urn;
exports.urn = urn;

const setMediatorUrn = mediatorUrn => {
  exports.urn = urn = mediatorUrn;
}; // The OpenHIM accepts a specific response structure which allows transactions to display correctly
// The openhimTransactionStatus can be one of the following values:
// Successful, Completed, Completed with Errors, Failed, or Processing


exports.setMediatorUrn = setMediatorUrn;

const buildReturnObject = (openhimTransactionStatus, httpResponseStatusCode, responseBody, orchs) => {
  return {
    'x-mediator-urn': urn,
    status: openhimTransactionStatus,
    response: {
      status: httpResponseStatusCode,
      timestamp: new Date(),
      headers: {
        'content-type': 'application/json'
      },
      body: responseBody
    },
    orchestrations: orchs
  };
};

exports.buildReturnObject = buildReturnObject;

const buildOrchestration = (name, beforeTimestamp, method, url, requestContent, res, body) => {
  let uri = new _urijs.default(url);
  return {
    name: name,
    request: {
      method: method,
      body: requestContent,
      timestamp: beforeTimestamp,
      path: uri.path(),
      querystring: uri.query()
    },
    response: {
      status: res.statusCode,
      headers: res.headers,
      body: "bruh",
      timestamp: new Date()
    }
  };
};

exports.buildOrchestration = buildOrchestration;