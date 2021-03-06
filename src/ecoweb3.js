const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');
const EcrcToken = require('./ecrctoken/ecrc-token');
const Contract = require('./contract');
const Rpc = require('./rpc');
const Api = require('./api');
const Tx = require('./transaction');
const Account = require('./account');
const Utils = require('./utils');
const ecocjs = require('./ecocjs');

class Ecoweb3 {
  /**
   * Ecoweb3 constructor.
   * @param {Object} config Either URL string to create HttpProvider or a Ecoweb3 compatible provider.
   */
  constructor(config) {
    const { rpcProvider, apiProvider, networkStr } = config;
    if (rpcProvider) {
      this.rpc = new Rpc(rpcProvider);
    }
    if (apiProvider) {
      this.api = new Api(apiProvider);
    }
    this.network = ecocjs.getNetwork(networkStr);
    this.tx = new Tx(this.network);
    this.account = new Account(this.network);
    this.encoder = Encoder;
    this.decoder = Decoder;
    this.utils = Utils;
  }

  /**
   * Constructs a new Contract instance.
   * @param {string} address Address of the contract.
   * @param {array} abi ABI of the contract.
   * @return {Contract} Contract instance.
   */
  Contract(address, abi) {
    if (this.rpc) {
      return new Contract(this.rpc.provider, address, abi);
    }

    throw Error('RPC Provider cannot be undefined.');
  }

  /**
   * ERC-20 Token Contract Implementation
   */
  EcrcToken(tokenAddress) {
    if (this.rpc) {
      return new EcrcToken(this.rpc, tokenAddress);
    }

    throw Error('RPC Provider cannot be undefined.');
  }

  /**
   * Constructs a new Rpc instance.
   * @param {string} urlStr URL of the blockchain RPC. eg. http://username:password@the.no.de.ip:port
   * @return {Rpc Object} HttpProvider instance.
   */
  static Rpc(urlStr) {
    return new Rpc(urlStr);
  }

  /**
   * Constructs a new Api instance.
   * @param {string} urlStr URL of the blockchain API. eg. http://api.n1.ecoc.io:port/api_prefix
   * @return {Api Object} HttpProvider instance.
   */
  static Api(urlStr) {
    return new Api(urlStr);
  }

  static Tx(networkStr) {
    return new Tx(ecocjs.getNetwork(networkStr));
  }

  static Account(networkStr) {
    return new Account(ecocjs.getNetwork(networkStr));
  }
}

module.exports = Ecoweb3;
