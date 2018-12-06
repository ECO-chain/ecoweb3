const { initAPI } = require('./providers');

class API {
  /**
   * Contract constructor.
   * @param {string|Ecoweb3Provider} apiProvider Either URL string to create HttpProvider or a Ecoweb3 compatible provider.
   */

  constructor(apiProvider) {
    this.apiProvider = initAPI(apiProvider);
  }

  ApiConfig(apiProvider) {
    if (!this.apiProvider) {
      this.apiProvider = initAPI(apiProvider);
    }
  }

  async isApiConnected() {
    try {
      const res = await this.apiProvider.Get('/sync');
      return typeof res === 'object';
    } catch (err) {
      return false;
    }
  }

  getUtxoList(address) {
    return this.apiProvider.Get(`/addrs/${address}/utxo`);
  }
}

module.exports = API;
