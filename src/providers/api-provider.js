const url = require('url');
const axios = require('axios');
const { isEmpty } = require('lodash');

/**
 * API Service Provider for interacting with the blockchain via RESTful API.
 */
class ApiProvider {
  /**
  * Configure the Api Service Provider.
  * @param {string} urlString URL of the blockchain API. eg. http://api.n1.ecoc.io:port/api_prefix
  */
  constructor(urlString) {
    this.apiUrl = url.parse(urlString);
  }

  /**
   * Executes a request to the blockchain via RESTful API request.
   * @param {string} resource A resource object of RESTful API.
   */

  async get(resource) {
    if (isEmpty(resource)) {
      throw Error('resource cannot be empty.');
    }

    if (isEmpty(this.apiUrl)) {
      throw Error('apiUrl need to be configured');
    }

    // Execute GET request
    const response = await axios.get(`${this.apiUrl.href.replace(/([^:]\/)\/+/g, '')}${resource}`, { timeout: 5000 })
      .catch((error) => {
        throw Error(error);
      });

    return response.data;
  }
}

module.exports = ApiProvider;
