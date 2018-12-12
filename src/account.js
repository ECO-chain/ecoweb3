const ecocjs = require('./ecocjs');

class Account {
  constructor(Network) {
    const network = (typeof Network === 'string') ? ecocjs.getNetwork(Network) : Network;
    this.network = network;
    this.setUtxo([]);
  }

  setUtxo(txs) {
    if (Array.isArray(txs)) {
      this.utxoList = txs;
    } else {
      throw Error('utxo must be list');
    }
  }

  send(args) {
    const {
      rpc,
      to,
      amount,
      fee,
      utxo,
    } = args;

    if (!rpc.provider) {
      throw Error('must provide with rpc object for sending tx');
    }
    if (!this.keyPair) {
      throw Error('dont have any keypair yet');
    }
    let txs = utxo;
    if (!txs) {
      txs = this.spendUtxo(amount, fee);
    }

    const rawSignedTx = ecocjs.utils.buildPubKeyHashTransaction(
      this.keyPair,
      to,
      amount,
      fee,
      txs,
    );
    return rpc.sendRawTx(rawSignedTx);
  }

  addUtxo(txs) {
    this.utxoList.push(...txs);
  }

  spendUtxo(amount, fee) {
    const spent = ecocjs.utils.selectTxs(this.utxoList, amount, fee);
    return spent;
  }

  getBalance(utxoList) {
    let txs = utxoList;
    if (!txs) {
      txs = this.utxoList;
    }
    const balance = ecocjs.utils.getBalanceFromTxs(txs);
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
