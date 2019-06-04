const ecocjs = require('./ecocjs');

const utxoFilter = (utxoList, subtracted) => utxoList.filter((item) => {
  for (let i = 0; i < subtracted.length; i++) {
    if (item.txid === subtracted[i].txid && item.vout === subtracted[i].vout) {
      return false;
    }
  }
  return true;
});

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

  addUtxo(txs) {
    const utxoLeft = utxoFilter(txs, this.utxoList);
    this.utxoList.push(...utxoLeft);
  }

  spendUtxo(amount, fee) {
    const spent = ecocjs.utils.selectTxs(this.utxoList, amount, fee);
    const utxoLeft = utxoFilter(this.utxoList, spent);
    this.utxoList = utxoLeft;
    return spent;
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
      const { address } = ecocjs.payments.p2pkh({ pubkey: this.keyPair.publicKey, network: this.network });
      return address;
    }
    throw Error('dont have any keypair yet');
  }

  toPubkey(buffer = false) {
    if (this.keyPair) {
      return buffer ? this.keyPair.publicKey : this.keyPair.publicKey.toString('hex');
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
    if (this.keyPair) {
      throw Error('already have keypair');
    }
    this.keyPair = ecocjs.ECPair.makeRandom(opts);
  }

  fromWIF(WIF) {
    if (this.keyPair) {
      throw Error('already have keypair');
    }
    this.keyPair = ecocjs.ECPair.fromWIF(WIF, this.network);
  }
}

module.exports = Account;
