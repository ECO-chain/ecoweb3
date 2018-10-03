const ercAbi = require('./erc-token-abi.json');
// const ecocjs = require('../txs')
const Contract = require('../contract');
// const Encoder = require('../formatters/encoder')
// const Decoder = require('../formatters/decoder')

class ErcToken {
  constructor(provider, contractAddress) {
    this.provider = provider;
    this.tokenAddress = contractAddress;
    this.contract = new Contract(this.provider, this.tokenAddress, ercAbi);
  }

  async findInfo() {
    this.tokenName = await this.name();
    this.tokenSymbol = await this.symbol();
    this.tokenDecimals = await this.decimals();
    this.tokenTotalSupply = await this.totalSupply();

    const tokenInfo = {
      name: this.tokenName,
      symbol: this.tokenSymbol,
      decimals: this.tokenDecimals,
      totalSupply: this.tokenTotalSupply,
    };
    return tokenInfo;
  }

  allowance() {
    return true;
  }

  approve() {
    return true;
  }

  transfer(keypair, toAddress, amount) {
    return [true, keypair, toAddress, amount];
  }

  transferFrom() {
    return true;
  }

  balanceOf(address) {
    const param = {
      methodArgs: [address],
      senderAddress: address,
    };

    return this.contract.call('balanceOf', param).then(res => res.executionResult.formattedOutput.balance.toString(10));
  }

  decimals() {
    const param = {
      methodArgs: [],
      senderAddress: '',
    };

    return this.contract.call('decimals', param).then(res => res.executionResult.formattedOutput.decimals.toString(10));
  }

  name() {
    const param = {
      methodArgs: [],
      senderAddress: '',
    };

    return this.contract.call('name', param).then(res => res.executionResult.formattedOutput.name);
  }

  symbol() {
    const param = {
      methodArgs: [],
      senderAddress: '',
    };

    return this.contract.call('symbol', param).then(res => res.executionResult.formattedOutput.symbol);
  }

  totalSupply() {
    const param = {
      methodArgs: [],
      senderAddress: '',
    };

    return this.contract.call('totalSupply', param).then(res => res.executionResult.formattedOutput.totalSupply.toString(10));
  }
}
module.exports = ErcToken;
