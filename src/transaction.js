const ecocjs = require('./ecocjs');

class Transaction {
  constructor(network) {
    this.network = network;
    this.script = ecocjs.script;
    this.selectUTXO = ecocjs.utils.selectTxs;
    this.buildPubKeyHash = ecocjs.utils.buildPubKeyHashTransaction;
    this.buildCreateContract = ecocjs.utils.buildCreateContractTransaction;
    this.buildSendToContract = ecocjs.utils.buildSendToContractTransaction;
  }

  TxBuilder() {
    return new ecocjs.TransactionBuilder(this.network);
  }

  TxFromHex(rawtx) {
    return ecocjs.Transaction.fromHex(rawtx);
  }

  TxFromBuffer(rawtx) {
    return ecocjs.Transaction.fromBuffer(rawtx);
  }
}

module.exports = Transaction;
