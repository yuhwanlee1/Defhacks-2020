'use strict';

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _openhimMediatorUtils = require("openhim-mediator-utils");

var _logger = _interopRequireDefault(require("./logger"));

var _config = require("./config/config");

var _utils = require("./routes/utils");

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The OpenHIM Mediator Utils is an essential package for quick mediator setup.
// It handles the OpenHIM authentication, mediator registration, and mediator heartbeat.
// The OpenHIM config is controlled via Environment Variables to prevent ever having to
// risk committing sensitive data to source control
const openhimConfig = {
  apiURL: _config.OPENHIM_URL,
  password: _config.OPENHIM_PASSWORD,
  username: _config.OPENHIM_USERNAME,
  trustSelfSigned: _config.TRUST_SELF_SIGNED
};

const mediatorSetup = () => {
  // The mediatorConfig file contains some basic configuration settings about the mediator
  // as well as details about the default channel setup.
  const mediatorConfigFile = _fs.default.readFileSync(_path.default.resolve(__dirname, '..', 'mediatorConfig.json'));

  let mediatorConfig;

  try {
    mediatorConfig = JSON.parse(mediatorConfigFile);
  } catch (error) {
    _logger.default.error(`Failed to parse JSON in mediatorConfig.json`);

    throw error;
  }

  openhimConfig.urn = mediatorConfig.urn;
  (0, _utils.setMediatorUrn)(mediatorConfig.urn); // The purpose of registering the mediator is to allow easy communication between the mediator and the OpenHIM.
  // The details received by the OpenHIM will allow quick channel setup which will allow tracking of requests from
  // the client through any number of mediators involved and all the responses along the way(if the mediators are
  // properly configured). Moreover, if the request fails for any reason all the details are recorded and it can
  // be replayed at a later date to prevent data loss.

  (0, _openhimMediatorUtils.registerMediator)(openhimConfig, mediatorConfig, err => {
    if (err) {
      throw new Error(`Failed to register mediator. Check your Config: ${err.message}`);
    }

    _logger.default.info('Successfully registered mediator!'); // The activateHeartbeat method returns an Event Emitter which allows the mediator to attach listeners waiting
    // for specific events triggered by OpenHIM responses to the mediator posting its heartbeat.


    const emitter = (0, _openhimMediatorUtils.activateHeartbeat)(openhimConfig);
    emitter.on('error', err => {
      _logger.default.error(`Heartbeat failed: ${JSON.stringify(err)}`);
    });
  });
};

const utils = () => {
  return {
    fetchChannelByName: (name, callback) => {
      (0, _openhimMediatorUtils.authenticate)(openhimConfig, () => {
        const options = {
          url: `${openhimConfig.apiURL}/channels`,
          headers: (0, _openhimMediatorUtils.genAuthHeaders)(openhimConfig),
          json: true
        };

        _request.default.get(options, (err, res, channels) => {
          if (err) {
            return callback(err);
          }

          let channel = null;
          channels.array.forEach(c => {
            if (c.name === name) {
              channel = c;
            }
          });

          if (channel) {
            callback(null, channel);
          } else {
            callback(new Error('Could not find Channel.'));
          }
        });
      });
    },
    updateChannel: (ID, channel, callback) => {
      (0, _openhimMediatorUtils.authenticate)(openhimConfig, () => {
        const options = {
          url: `${openhimConfig.apiURL}/channels/${ID}`,
          headers: (0, _openhimMediatorUtils.genAuthHeaders)(openhimConfig),
          body: channel,
          json: true
        };

        _request.default.put(options, (err, res) => {
          if (err) {
            return callback(err);
          }

          callback();
        });
      });
    },
    updateConfig: (urn, configUpdate, callback) => {
      (0, _openhimMediatorUtils.authenticate)(openhimConfig, () => {
        const options = {
          url: `${openhimConfig.apiURL}/mediators/${urn}/config`,
          headers: (0, _openhimMediatorUtils.genAuthHeaders)(openhimConfig),
          body: configUpdate,
          json: true
        };

        _request.default.put(options, (err, res, body) => {
          if (err) {
            return callback(err);
          }

          callback();
        });
      });
    }
  };
};

exports.mediatorSetup = mediatorSetup;
exports.config = openhimConfig;
exports.utils = utils;