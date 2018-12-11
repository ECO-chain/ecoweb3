const ecocjs = require('./ecocjs');

class Account {
  constructor(AccountNetwork) {
    const network = (typeof AccountNetwork === 'string') ? ecocjs.getNetwork(AccountNetwork) : AccountNetwork;
    const utxoList = [];

    this.network = network;
    this.utxoList = utxoList;
  }

  addUtxo(utxoList) {
    this.utxoList.push(...utxoList);
  }

  spendUtxo(amount, fee) {
    const spent = ecocjs.utils.selectTxs(this.utxoList, amount, fee);
    return spent;
  }

  getBalance(utxoList) {
    if (!utxoList) {
      utxoList = this.utxoList;
    }
    const balance = ecocjs.utils.getBalanceFromTxs(utxoList);

    return {
      amount: balance.div(1e8).toNumber(),
      satoshis: balance.toNumber(),
    };
  }

  getKeypair() {
    if (this.keyPair) {
      return this.keyPair;
    }
    throw Error('dont have any keypair yet');
  }

  toAddr() {
    if (this.keyPair) {
      return this.keyPair.getAddress();
    }
    throw Error('dont have any keypair yet');
  }

  toPubkey(buffer = false) {
    if (this.keyPair) {
      return buffer ? this.keyPair.getPublicKeyBuffer() : this.keyPair.getPublicKeyBuffer().toString('hex');
    }
    throw Error('dont have any keypair yet');
  }

  toWIF() {
    if (this.keyPair) {
      return this.keyPair.toWIF();
    }
    throw Error('dont have any account yet');
  }

  createNewAddress(rng) {
    const opts = { network: this.network };
    if (rng) {
      opts.rng = rng;
    }
    if (!this.keyPair) {
      this.keyPair = ecocjs.ECPair.makeRandom(opts);
    }
  }

  fromWIF(WIF) {
    if (!this.keyPair) {
      this.keyPair = ecocjs.ECPair.fromWIF(WIF, this.network);
    }
  }
}

module.exports = Account;
