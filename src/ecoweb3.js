const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');
const ErcToken = require('./erctoken/erc-token');
const Contract = require('./contract');
const Rpc = require('./rpc');
const Api = require('./api');
const Tx = require('./transaction');
const Account = require('./account');
const Utils = require('./utils');
const ecocjs = require('./ecocjs');

const ecocMainnet = ecocjs.networks.ecoc;
const ecocTestnet = ecocjs.networks.ecoc_testnet;

const getNetwork = networkStr => ((networkStr === 'Testnet') ? ecocTestnet : ecocMainnet);

class Ecoweb3 {
  /**
   * Ecoweb3 constructor.
   * @param {string|Ecoweb3Provider} config Either URL string to create HttpProvider or a Ecoweb3 compatible provider.
   */
  constructor(config = {
    rpcProvider: null,
    apiProvider: null,
    networkStr: null,
  }) {
    const { rpcProvider, apiProvider, networkStr } = config;

    if (rpcProvider) {
      this.rpc = new Rpc(rpcProvider);
    }
    if (apiProvider) {
      this.api = new Api(apiProvider);
    }
    console.log(rpcProvider, apiProvider, networkStr);
    this.network = getNetwork(networkStr);
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
  ErcToken(tokenAddress) {
    if (this.rpc) {
      return new ErcToken(this.rpc, tokenAddress);
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
    return new Tx(getNetwork(networkStr));
  }

  static Account(networkStr) {
    return new Account(getNetwork(networkStr));
  }
}

module.exports = Ecoweb3;
