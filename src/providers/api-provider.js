const url = require('url');
const axios = require('axios');
const { isEmpty } = require('lodash');

/**
 * API Service Provider for interacting with the blockchain via RESTful API.
 */
class ApiProvider {
  /**
  * Configure the Api Service Provider.
  * @param {string} urlString URL of the blockchain API. eg. http://api.n1.ecoc.io:port
  * @param {string} apiPrefix the prefix of the api server /api /insigh-api eg. http://api.n1.ecoc.io:port/ecoc-api the prefix is /ecoc-api
  */
  constructor(urlString, apiPrefix) {
    this.apiUrl = url.parse(urlString);
    this.apiPrefix = apiPrefix;
  }

  /**
   * Executes a request to the blockchain via RESTful API request.
   * @param {string} resource A resource object of RESTful API.
   */

  async Get(resource) {
    if (isEmpty(resource)) {
      throw Error('resource cannot be empty.');
    }

    if (isEmpty(this.apiUrl)) {
      throw Error('apiUrl need to be configured');
    }

    // Execute GET request
    const response = await axios.get(`${this.apiUrl.protocol}//${this.apiUrl.host}${this.apiPrefix}${resource}`, { timeout: 5000 })
      .catch((error) => {
        throw Error(error);
      });

    return response.data;
  }
}

module.exports = ApiProvider;
