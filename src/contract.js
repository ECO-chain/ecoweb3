const { initProvider } = require('./providers');
const Utils = require('./utils');
const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');
const Ecoctx = require('./txs');

const DEFAULT_AMOUNT = 0;
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004; // Unit: ECO

class Contract {
  /**
   * Contract constructor.
   * @param {string|Ecoweb3Provider} provider Either URL string to create HttpProvider or a Ecoweb3 compatible provider.
   * @param {string} address Address of the contract.
   * @param {array} abi ABI of the contract.
   */
  constructor(provider, address, abi) {
    this.provider = initProvider(provider);
    this.address = Utils.trimHexPrefix(address);
    this.abi = abi;
    this.amount = DEFAULT_AMOUNT;
    this.gasLimit = DEFAULT_GAS_LIMIT;
    this.gasPrice = DEFAULT_GAS_PRICE;
  }

  /**
   * Executes a callcontract on a view/pure method.
   * @param {string} methodName Name of contract method
   * @param {object} params Parameters of contract method
   * @return {Promise} Call result.
   */
  async call(methodName, params) {
    const { methodArgs, senderAddress } = params;
    const data = Encoder.constructData(this.abi, methodName, methodArgs);
    let result = await this.provider.rawCall('callcontract', [this.address, data, senderAddress]);
    result = Decoder.decodeCall(result, this.abi, methodName, true); // Format the result
    return result;
  }

  /**
   * Executes a sendtocontract transaction.
   * @param {string} methodName Method name to call.
   * @param {object} params Parameters of the contract method.
   * @return {Promise} Transaction ID of the sendtocontract.
   */
  async send(methodName, params) {
    // Throw if methodArgs or senderAddress is not defined in params
    Utils.paramsCheck('send', params, ['methodArgs', 'senderAddress']);

    const { methodArgs, amount, gasLimit, gasPrice, senderAddress } = params;
    const data = Encoder.constructData(this.abi, methodName, methodArgs);
    const amt = amount || this.amount;
    const limit = gasLimit || this.gasLimit;
    const price = gasPrice || this.gasPrice;

    const result = await this.provider.rawCall('sendtocontract', [
      this.address,
      data,
      amt,
      limit,
      price.toFixed(8),
      senderAddress,
    ]);

    // Add original request params to result obj
    result.args = {
      contractAddress: this.address,
      amount: amt,
      gasLimit: limit,
      gasPrice: price,
    };
    return result;
  }
  CreateSignedSendTx(keypair, contractAddress, methodName, params, utxoList) {
    // Utils.paramsCheck('send', params, ['methodArgs'])

    const { methodArgs, amount, gasLimit, gasPrice } = params;
    const encodedData = Encoder.constructData(this.abi, methodName, methodArgs);
    const amt = amount || this.amount;
    const limit = gasLimit || this.gasLimit;
    const price = gasPrice || this.gasPrice;

    const tx = Ecoctx.utils.buildSendToContractTransaction(keypair, contractAddress, encodedData, limit, price * 1e8, amt, utxoList);

    return tx;
  }
}

module.exports = Contract;
