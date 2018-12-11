const ecocjs = require('bitcoinjs-lib');

Object.assign(ecocjs.networks, require('./networks'));

ecocjs.utils = require('./utils');

ecocjs.getNetwork = networkStr => ((networkStr === 'Testnet') ? ecocjs.networks.ecoc_testnet : ecocjs.networks.ecoc);

module.exports = ecocjs;
