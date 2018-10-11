const ecocjs = require('bitcoinjs-lib');

Object.assign(ecocjs.networks, require('./networks'));

ecocjs.txs = require('./utils');

module.exports = ecocjs;
