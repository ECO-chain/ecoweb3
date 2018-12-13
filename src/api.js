const { initAPI } = require('./providers');

class API {
  /**
   * Api constructor.
   * @param {string|Ecoweb3Provider} apiProvider Either URL string to create HttpProvider or a Ecoweb3 compatible provider.
   */

  constructor(apiProvider) {
    this.provider = initAPI(apiProvider);
  }

  async isConnected() {
    try {
      const res = await this.provider.get('/sync');
      return typeof res === 'object';
    } catch (err) {
      return false;
    }
  }

  getUtxoList(address) {
    return this.provider.get(`/addrs/${address}/utxo`);
  }
}

module.exports = API;
