const ecocjs = require('bitcoinjs-lib');

Object.assign(ecocjs.networks, require('./networks'));

ecocjs.utils = require('./utils');

module.exports = ecocjs;
