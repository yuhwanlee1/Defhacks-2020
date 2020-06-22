'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = openinfoman;

var _request = _interopRequireDefault(require("request"));

var _urijs = _interopRequireDefault(require("urijs"));

var _utils = require("./routes/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function openinfoman(cfg) {
  const config = cfg;
  return {
    /**
     * fetches all entities in a particular CSD document and calls back with the full CSD document.
     * @param {string in the form 'yyyy-mm-ddThh:mm:ss'} lastFetch : the last time the document was fetched
     * @param {boolean} reset : whether or not to reset lastFetch
     * @param {function} callback : takes the form of callback(err, result, orchestrations)
     */
    fetchAllEntities: function (callback) {
      let URI = new _urijs.default(config.url).segment('CSD/csr').segment(config.queryDocument).segment('careServicesRequest').segment('/urn:ihe:iti:csd:2014:stored-function:facility-search');
      let username = config.username;
      let password = config.password;
      let auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
      let options = {
        url: URI.toString(),
        headers: {
          Authorization: auth,
          'Content-Type': 'text/xml'
        },
        body: `<csd:requestParams xmlns:csd="urn:ihe:iti:csd:2013"></csd:requestParams>`
      };
      let before = new Date();

      _request.default.post(options, (err, res, body) => {
        if (err) {
          return callback(err);
        }

        callback(null, body, [(0, _utils.buildOrchestration)('Fetch OpenInfoMan Entities', before, 'POST', options.url, options.body, res, body)]);
      });
    }
  };
}