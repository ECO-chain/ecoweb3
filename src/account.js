const ecocjs = require('./ecocjs');

const Rng = () => { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

class Account {
  constructor(network) {
    this.network = network
    this.utxoList =[]
  }

  addUtxo(utxoList) {
    this.utxoList.push(...utxoList)
  }

  spendUtxo(amount, fee) {
    const spent = ecocjs.utils.selectTxs(this.utxoList, amount, fee)
    return spent
  }
  
  createNewAddress(rng=Rng) {
    if (!this.account) {
      this.account=ecocjs.ECPair.makeRandom({ network: this.network, rng: rng })
    }
    return this.account.getAddress()
  }

  fromWIF(WIF) {
    if (!this.account) {
      this.account=ecocjs.ECPair.fromWIF(WIF)
    }
    return this.account.getAddress()
  }

  fromSHA256 (hash) {
    if (!this.account) {
      this.account=ecocjs.ECPair.fromPrivateKey(hash)
    }
    return this.account.getAddress()
  }
  toWIF() {
    if (this.account) {
      return this.account.toWIF()
    }
    else {
      throw Error('dont have any account yet');
    }
  }
}

module.exports = Account;
