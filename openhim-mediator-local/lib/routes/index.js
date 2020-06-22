'use strict';

var _express = _interopRequireDefault(require("express"));

var _utils = require("./utils");

var _endpoint = _interopRequireDefault(require("./endpoint"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = _express.default.Router();

routes.get('/update', _endpoint.default); // Add more routes here if needed
// Any request regardless of request type or url path to the mediator port will be caught here
// and trigger the canned response. It may be useful in diagnosing incorrectly configured
// channels from the OpenHIM Console.

routes.all('*', (req, res) => {
  _logger.default.error(`Failed! Endpoint "${req.url}" & HTTP method "${req.method}" combination not found.`);

  const returnObject = (0, _utils.buildReturnObject)('Failed', 404, {
    message: 'Combination not found',
    url: req.url,
    method: req.method
  }, []);
  res.status(404).send(returnObject);
});
module.exports = routes;