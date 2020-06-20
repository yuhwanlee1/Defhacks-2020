'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRUST_SELF_SIGNED = exports.OPENHIM_PASSWORD = exports.OPENHIM_USERNAME = exports.OPENHIM_URL = exports.LOG_LEVEL = exports.SERVER_PORT = void 0;
const SERVER_PORT = 3002;
exports.SERVER_PORT = SERVER_PORT;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'; // OpenHIM

exports.LOG_LEVEL = LOG_LEVEL;
const OPENHIM_URL = process.env.OPENHIM_URL || 'https://localhost:8080';
exports.OPENHIM_URL = OPENHIM_URL;
const OPENHIM_USERNAME = process.env.OPENHIM_USERNAME || 'root@openhim.org';
exports.OPENHIM_USERNAME = OPENHIM_USERNAME;
const OPENHIM_PASSWORD = process.env.OPENHIM_PASSWORD || 'openhim-password';
exports.OPENHIM_PASSWORD = OPENHIM_PASSWORD;
const TRUST_SELF_SIGNED = process.env.TRUST_SELF_SIGNED === 'true';
exports.TRUST_SELF_SIGNED = TRUST_SELF_SIGNED;