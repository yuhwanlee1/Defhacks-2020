'use strict';

var _express = _interopRequireDefault(require("express"));

var _openhim = _interopRequireDefault(require("./openhim"));

var _config = require("./config/config");

var _routes = _interopRequireDefault(require("./routes/"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const app = (0, _express.default)();
app.use(_express.default.json());
app.use('/', _routes.default);
app.listen(_config.SERVER_PORT, () => {
  _logger.default.info(`Server listening on Port ${_config.SERVER_PORT}...`);

  _openhim.default.mediatorSetup();
});