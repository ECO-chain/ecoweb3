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

  getAddressInfo(address) {
    return this.provider.get(`/addr/${address}`);
  }

  getEcrc20(address) {
    return this.provider.get(`/ecrc20/balances?balanceAddress=${address}`);
  }

  getTokenInfo(contractAddress) {
    return this.provider.get(`/ecrc20/${contractAddress}`);
  }

  getTxList(address) {
    return this.provider.get(`/txs/?address=${address}`);
  }

  sendRawTx(rawTx) {
    return this.provider.post('/tx/send', { rawtx: rawTx });
  }

  fetchRawTx(txid) {
    return this.provider.get(`/rawtx/${txid}`);
  }

  callContract(address, encodedData) {
    return this.provider.get(`/contracts/${address}/hash/${encodedData}/call`);
  }
}

module.exports = API;
