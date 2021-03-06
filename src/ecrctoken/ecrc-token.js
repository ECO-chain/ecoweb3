const EcrcAbi = require('./ecrc-token-abi.json');
const Contract = require('../contract');
const ecocjs = require('../ecocjs');

class EcrcToken {
  constructor(provider, contractAddress) {
    this.provider = provider;
    this.tokenAddress = contractAddress;
    this.contract = new Contract(this.provider, this.tokenAddress, EcrcAbi);
  }

  async isEcrcToken() {
    return await this.totalSupply() !== '0';
  }

  async findInfo() {
    if (await this.isEcrcToken() === false) {
      throw Error('This is not ECRC-20 Token');
    }

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

  approve(spender, amount, account) {
    const { keypair, utxoList } = account;
    const { address } = ecocjs.payments.p2pkh({ pubkey: this.keyPair.publicKey, network: this.network });
    const senderAddress = address;
    const params = {
      methodArgs: [spender, amount],
      senderAddress,
    };

    const contractTx = this.contract.CreateSignedSendToTx(
      keypair,
      this.contract.address,
      'approve',
      params,
      utxoList,
    );
    return this.provider.rawCall('sendrawtransaction', [contractTx]);
  }

  transfer(to, amount, account) {
    const { keypair, utxoList } = account;
    const { address } = ecocjs.payments.p2pkh({ pubkey: this.keyPair.publicKey, network: this.network });
    const senderAddress = address;
    const params = {
      methodArgs: [to, amount],
      senderAddress,
    };

    const contractTx = this.contract.CreateSignedSendToTx(
      keypair,
      this.contract.address,
      'transfer',
      params,
      utxoList,
    );
    return this.provider.rawCall('sendrawtransaction', [contractTx]);
  }

  transferFrom(from, to, amount, account) {
    const { keypair, utxoList } = account;
    const { address } = ecocjs.payments.p2pkh({ pubkey: this.keyPair.publicKey, network: this.network });
    const senderAddress = address;
    const params = {
      methodArgs: [from, to, amount],
      senderAddress,
    };

    const contractTx = this.contract.CreateSignedSendToTx(
      keypair,
      this.contract.address,
      'transferFrom',
      params,
      utxoList,
    );
    return this.provider.rawCall('sendrawtransaction', [contractTx]);
  }

  allowance(tokenOwner, spender) {
    const param = {
      methodArgs: [tokenOwner, spender],
      senderAddress: '',
    };

    return this.contract.call('allowance', param).then(res => res.executionResult.formattedOutput.amount.toString(10));
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
module.exports = EcrcToken;
