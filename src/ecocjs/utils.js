const bitcoinjs = require('bitcoinjs-lib');
const { BigNumber } = require('bignumber.js');

const OPS = require('./opcodes.js');
const { Buffer } = require('safe-buffer');

/** function that converts a number to a buffer
 *  @param number
 *  @returns a buffer
 */
function number2Buffer(num) {
  /* eslint-disable no-bitwise */
  const buffer = [];
  const neg = (num < 0);
  /* eslint-disable no-param-reassign */
  num = Math.abs(num);
  while (num) {
    buffer[buffer.length] = num & 0xff;
    num >>= 8;
  }

  const top = buffer[buffer.length - 1];
  if (top & 0x80) {
    buffer[buffer.length] = neg ? 0x80 : 0x00;
  } else if (neg) {
    buffer[buffer.length - 1] = top | 0x80;
  }
  return Buffer.from(buffer);
}

/** function that converts a hex string to a buffer
 *  @param hexString
 *  @returns a buffer
 */
function hex2Buffer(hexString) {
  const buffer = [];
  let i;
  for (i = 0; i < hexString.length; i += 2) {
    buffer[buffer.length] = (parseInt(hexString[i], 16) << 4) | parseInt(hexString[i + 1], 16); // eslint-disable-line no-bitwise
  }
  return Buffer.from(buffer);
}

/**
 * This is a function for get the total balance of ecochain in utxos
 * the transaction object takes at least 3 fields, value(unit is 1e-8 ECO) , confirmations and isStake
 *
 * @param [transaction] unspentTransactions
 * @returns [amount] (Unit ECO)
 */
function getBalanceFromTxs(unspentTransactions, confimation = 0) {
  /* compute total balance */
  let amount = new BigNumber(0);
  unspentTransactions.forEach((tx) => {
    if (tx.confirmations >= confimation) {
      amount = amount.plus(tx.satoshis);
    }
  });
  return amount;
}

/**
 * This is a function for selecting ecochain utxos to build transactions
 * the transaction object takes at least 3 fields, value(unit is 1e-8 ECO) , confirmations and isStake
 *
 * @param [transaction] unspentTransactions
 * @param Number amount(unit: ECO)
 * @param Number fee(unit: ECO)
 * @returns [transaction]
 */
function selectTxs(unspentTransactions, amount, fee) {
  /* sort the utxo */
  const matureList = [];
  const immatureList = [];
  let i;
  for (i = 0; i < unspentTransactions.length; i++) {
    if (unspentTransactions[i].confirmations >= 500 || unspentTransactions[i].isStake === false) {
      matureList[matureList.length] = unspentTransactions[i];
    } else {
      immatureList[immatureList.length] = unspentTransactions[i];
    }
  }
  matureList.sort((a, b) => a.value - b.value);
  immatureList.sort((a, b) => b.confirmations - a.confirmations);
  /* eslint-disable no-param-reassign */
  unspentTransactions = matureList.concat(immatureList);

  /* compute total balance */
  const value = new BigNumber(amount).plus(fee).times(1e8); /* add fee and add 8 digits to total */
  const find = [];
  let findTotal = new BigNumber(0); /* current balance */
  for (i = 0; i < unspentTransactions.length; i++) {
    const tx = unspentTransactions[i];
    findTotal = findTotal.plus(tx.satoshis);
    find[find.length] = tx;
    if (findTotal.isGreaterThanOrEqualTo(value)) break;
  }
  if (value.isGreaterThan(findTotal)) {
    throw new Error('You do not have enough ECO to send');
  }
  return find;
}

/**
 * This is a helper function to build a pubkeyhash transaction
 * the transaction object takes at least 5 fields, value(unit is 1e-8 ECO), confirmations, isStake, hash and pos
 *
 * @param bitcoinjs-lib.KeyPair keyPair
 * @param String to
 * @param Number amount(unit: ECO)
 * @param Number fee(unit: ECO)
 * @param [transaction] utxoList
 * @returns String the built tx
 */
function buildPubKeyHashTransaction(keyPair, to, amount, fee, utxoList) {
  const { address } = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: keyPair.network });
  const from = address;
  const inputs = selectTxs(utxoList, amount, fee);
  const tx = new bitcoinjs.TransactionBuilder(keyPair.network);
  let totalValue = new BigNumber(0);
  const value = new BigNumber(amount).times(1e8);
  const sendFee = new BigNumber(fee).times(1e8);
  let i;
  for (i = 0; i < inputs.length; i++) {
    tx.addInput(inputs[i].txid, inputs[i].vout);
    totalValue = totalValue.plus(inputs[i].satoshis);
  }
  tx.addOutput(to, new BigNumber(value).toNumber());
  if (totalValue.minus(value).minus(sendFee).toNumber() > 0) {
    tx.addOutput(from, totalValue.minus(value).minus(sendFee).toNumber());
  }
  for (i = 0; i < inputs.length; i++) {
    tx.sign(i, keyPair);
  }
  return tx.build().toHex();
}

/**
 * This is a helper function to build a create-contract transaction
 * the transaction object takes at least 5 fields, value(unit is 1e-8 ECO), confirmations, isStake, hash and pos
 *
 * @param bitcoinjs-lib.KeyPair keyPair
 * @param String code The contract byte code
 * @param Number gasLimit
 * @param Number gasPrice(unit: 1e-8 ECO/gas)
 * @param Number fee(unit: ECO)
 * @param [transaction] utxoList
 * @returns String the built tx
 */
function buildCreateContractTransaction(keyPair, code, gasLimit, gasPrice, fee, utxoList) {
  const from = keyPair.getplusress();
  const amount = 0;
  fee = new BigNumber(gasLimit).times(gasPrice).div(1e8).plus(fee)
    .toNumber();
  const inputs = selectTxs(utxoList, amount, fee);
  const tx = new bitcoinjs.TransactionBuilder(keyPair.network);
  let totalValue = new BigNumber(0);
  const sendFee = new BigNumber(fee).times(1e8);
  let i;
  for (i = 0; i < inputs.length; i++) {
    tx.addInput(inputs[i].txid, inputs[i].vout);
    totalValue = totalValue.plus(inputs[i].satoshis);
  }
  /* eslint-disable no-param-reassign */
  const contract = bitcoinjs.script.compile([
    OPS.OP_4,
    number2Buffer(gasLimit),
    number2Buffer(gasPrice),
    hex2Buffer(code),
    OPS.OP_CREATE, /* AAL opcode for creating smart contracts */
  ]);
  tx.addOutput(contract, 0);
  if (totalValue.minus(sendFee).toNumber() > 0) {
    tx.addOutput(from, totalValue.minus(sendFee).toNumber());
  }
  for (i = 0; i < inputs.length; i++) {
    tx.sign(i, keyPair);
  }
  return tx.build().toHex();
}

/**
 * This is a helper function to build a send-to-contract transaction
 * the transaction object takes at least 5 fields, value(unit is 1e-8 ECO), confirmations, isStake, hash and pos
 *
 * @param bitcoinjs-lib.KeyPair keyPair
 * @param String contractAddress The contract address
 * @param String encodedData The encoded abi data
 * @param Number gasLimit
 * @param Number gasPrice(unit: 1e-8 ECO/gas)
 * @param Number fee(unit: ECO)
 * @param [transaction] utxoList
 * @returns String the built tx
 */
function buildSendToContractTransaction(keyPair, contractAddress, encodedData, gasLimit, gasPrice, fee, utxoList) {
  const { address } = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey, network: keyPair.network });
  const from = address;
  const amount = 0;
  fee = new BigNumber(gasLimit).times(gasPrice).div(1e8).plus(fee)
    .toNumber();
  const inputs = selectTxs(utxoList, amount, fee);
  const tx = new bitcoinjs.TransactionBuilder(keyPair.network);
  let totalValue = new BigNumber(0);
  const sendFee = new BigNumber(fee).times(1e8);
  let i;
  for (i = 0; i < inputs.length; i++) {
    tx.addInput(inputs[i].txid, inputs[i].vout);
    totalValue = totalValue.plus(inputs[i].satoshis);
  }
  const contract = bitcoinjs.script.compile([
    OPS.OP_4,
    number2Buffer(gasLimit),
    number2Buffer(gasPrice),
    hex2Buffer(encodedData),
    hex2Buffer(contractAddress),
    OPS.OP_CALL,
  ]);
  tx.addOutput(contract, amount);
  // console.log(totalValue.minus(sendFee).toNumber())
  if (totalValue.minus(sendFee).toNumber() > 0) {
    tx.addOutput(from, totalValue.minus(sendFee).minus(amount).toNumber());
  }
  for (i = 0; i < inputs.length; i++) {
    tx.sign(i, keyPair);
  }
  return tx.build().toHex();
}

module.exports = {
  getBalanceFromTxs,
  selectTxs,
  buildPubKeyHashTransaction,
  buildCreateContractTransaction,
  buildSendToContractTransaction,
};
