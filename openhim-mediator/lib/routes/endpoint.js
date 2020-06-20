'use strict';

var _logger = _interopRequireDefault(require("../logger"));

var _openinfoman = _interopRequireDefault(require("../openinfoman"));

var _openhim = _interopRequireDefault(require("../openhim"));

var _adapter2 = _interopRequireDefault(require("../adapter"));

var _xpath = _interopRequireDefault(require("xpath"));

var _underscore = _interopRequireDefault(require("underscore"));

var _axios = _interopRequireDefault(require("axios"));

var _snakeCase = require("snake-case");

var _xmldom = require("xmldom");

var _utils = require("./utils");

var _openhimMediatorUtils = require("openhim-mediator-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (_req, res) => {
  (0, _openhimMediatorUtils.fetchConfig)(_openhim.default.config, (err, newConfig) => {
    let config = newConfig;

    _logger.default.info('Update Triggered...');

    let orchestrations = [];
    const OIM = (0, _openinfoman.default)(config.openinfoman);
    const adapter = (0, _adapter2.default)(config);

    function reportFailure(err) {
      res.writeHead(500, {
        'Content-Type': 'application/json+openhim'
      });

      _logger.default.error(err.stack);

      _logger.default.error('Something went wrong; relaying error to OpenHIM-core.');

      const response = (0, _utils.buildReturnObject)('Failed', 500, err.stack, orchestrations);
      res.end(response);
    }

    _logger.default.info('Pulling providers from OpenInfoMan...');

    OIM.fetchAllEntities((err, CSDDoc, orchs) => {
      if (orchs) {
        orchestrations = orchestrations.concat(orchs);
      }

      if (err) {
        return reportFailure(err);
      }

      if (!CSDDoc) {
        return reportFailure(new Error('No CSD document returned.'));
      }

      _logger.default.info('Done fetching providers.'); //extract CSD entities


      const doc = new _xmldom.DOMParser().parseFromString(CSDDoc); //console.log(doc)

      const select = _xpath.default.useNamespaces({
        'csd': 'urn:ihe:iti:csd:2013'
      });

      let entities = select('/csd:CSD/csd:providerDirectory/csd:provider', doc);
      entities = entities.map(entity => entity.toString());

      _logger.default.info(`Converting ${entities.length} CSD entities to database entries...`);

      let entries = entities.map(entity => {
        try {
          return adapter.convertCSDToDBEntry(entity);
        } catch (err) {
          _logger.default.warn(`${err.message}, skipping provider.`);

          return null;
        }
      }).filter(c => {
        return c !== null;
      });

      _logger.default.info(`Adding/Updating ${entries.length} entries to database...`);

      const tableName = (0, _snakeCase.snakeCase)(config.facility);
      const url = `http://35.209.62.112:3000/${tableName}`;

      _logger.default.info(`Sending put request to ${url}`);

      _axios.default.put(url, entries).then(function (response) {
        _logger.default.info(`Successfully updated table ${tableName}.`);

        const returnObject = (0, _utils.buildReturnObject)('Successful', 200, 'Endpoint Response!', orchestrations);
        res.set('Content-Type', 'application/json+openhim');
        res.send(returnObject);
      }).catch(function (err) {
        _logger.default.error(`Failed to update table ${tableName}.`);

        return reportFailure(err);
      });
    });
  });
};