'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adapter;

var _xpath = _interopRequireDefault(require("xpath"));

var _lodash = _interopRequireDefault(require("lodash"));

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

      const uuid = _xpath.default.select('/provider/@entityID', doc)[0].value;

      const name = _xpath.default.select('/provider/demographic/name/commonName/text()', doc)[0].toString();

      const telNodes = _xpath.default.select('/provider/demographic/contactPoint/codedType[@code="BP" and @codingScheme="urn:ihe:iti:csd:2013:contactPoint"]/text()', doc);

      let tels = [];
      telNodes.forEach(telNode => {
        tels.push(telNode.toString());
      });

      if (name == null || name == undefined || name === "") {
        throw new Error(`Couldn\'t find a name for provider with UUID ${uuid}`);
      }

      if (tels.length === 0) {
        throw new Error(`Couldn\'t find a telephone number for ${name}`);
      }

      const entry = {
        "name": name,
        "phone": tels[0]
      };
      return entry;
    }
  };
}