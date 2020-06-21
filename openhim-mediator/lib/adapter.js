'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adapter;

var _xpath = _interopRequireDefault(require("xpath"));

var _lodash = _interopRequireDefault(require("lodash"));

var _phone = _interopRequireDefault(require("phone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Dom = require('xmldom').DOMParser;

function adapter(config) {
  return {
    /**
     * convertCSDToDBEntry - converts a CSD provider into a MySQL database entry in the form of an array
     *
     * @param  {String} entity An CSD XML representation of the provider
     * @return {Object}        A JSON object containing the provider's name and phone number
     */
    convertCSDToDBEntry: function (entity) {
      entity = entity.replace(/\s\s+/g, '');
      entity = entity.replace(/.xmlns.*?\"(.*?)\"/g, '');
      const doc = new Dom().parseFromString(entity);

      const uuid = _xpath.default.select('/facility/@entityID', doc)[0].value;

      const dept = _xpath.default.select('/facility/primaryName/text()', doc)[0].toString();

      const name = _xpath.default.select('/facility/contact/person/name/commonName/text()', doc)[0].toString();

      const telNodes = _xpath.default.select('/facility/contactPoint/codedType[@code="BP" and @codingScheme="urn:ihe:iti:csd:2013:contactPoint"]/text()', doc);

      let tels = [];
      telNodes.forEach(telNode => {
        tels.push(telNode.toString());
      });

      if (dept == null || dept == undefined || dept === "") {
        throw new Error(`Couldn\'t find a name for the facility with UUID ${uuid}`);
      }

      if (name == null || name == undefined || name === "") {
        throw new Error(`Couldn\'t find a provider associated with the facility with UUID ${uuid}`);
      }

      if (tels.length === 0) {
        throw new Error(`Couldn\'t find a telephone number for the facility with UUID ${uuid}`);
      }

      const entry = {
        "department": dept,
        "name": name,
        "phone": (0, _phone.default)(tels[0])[0]
      };
      return entry;
    }
  };
}