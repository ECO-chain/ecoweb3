const url = require('url');
const axios = require('axios');
const { isEmpty } = require('lodash');

/**
 * HTTP Provider for interacting with the blockchain via JSONRPC POST calls.
 */
class HttpProvider {
  /**
   * Constructor.
   * @param {string} urlString URL of the blockchain API. eg. http://username:password@th.no.de.ip:port
   */
  constructor(urlString) {
    this.url = url.parse(urlString);
    this.apiUrl = null;
    this.apiPrefix = null;
  }

  /**
   * Configure the Api Service Provider.
   * @param {string} urlString URL of the blockchain API. eg. http://api.n1.ecoc.io:port
   * @param {string} apiPrefix the prefix of the api server /api /insigh-api eg. http://api.n1.ecoc.io:port/ecoc-api the prefix is /ecoc-api
   */
  apiConfig(urlString, apiPrefix) {
    this.apiUrl = url.parse(urlString);
    this.apiPrefix = apiPrefix;

    return true;
  }

  /**
   * Executes a request to the blockchain via JSONRPC POST request.
   * @param {string} method Blockchain method to call. eg. 'sendtocontract'
   * @param {array} args Raw arguments for the call. [contractAddress, data, amount?, gasLimit?, gasPrice?]
   */
  async rawCall(method, args = []) {
    if (isEmpty(method)) {
      throw Error('method cannot be empty.');
    }

    // Construct body
    const body = {
      id: new Date().getTime(),
      jsonrpc: '1.0',
      method,
      params: args,
    };

    // Execute POST request
    const { result, error } = (await axios({
      method: 'post',
      url: `${this.url.protocol}//${this.url.host}`,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Basic ${Buffer.from(this.url.auth).toString('base64')}`,
      },
      data: JSON.stringify(body),
    })).data;

    // Handle error
    if (error) {
      throw Error(error);
    }

    return result;
  }
  async apiCall(uri) {
    if (isEmpty(uri)) {
      throw Error('uri cannot be empty.');
    }
    if (isEmpty(this.apiUrl)) {
      throw Error('apiUrl need to be configured');
    }

    // Execute GET request
    const response = await axios.get(`${this.apiUrl.protocol}//${this.apiUrl.host}${this.apiPrefix}${uri}`, { timeout: 5000 })
      .catch((error) => {
        throw Error(error);
      });
    return response.data;
  }
}

module.exports = HttpProvider;
