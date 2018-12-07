/* eslint-disable no-underscore-dangle, max-len */
const _ = require('lodash');
const Web3Utils = require('web3-utils');
const BN = require('bn.js');
const chai = require('chai');

const { getEcocRPCAddress } = require('../test/utils');
const ContractMetadata = require('../test/data/contract_metadata');
const Contract = require('../src/contract');
const Decoder = require('../src/formatters/decoder');

const { assert } = chai;

describe('Contract', () => {
  let contract;

  describe('constructor', () => {
    it('inits all the values', async () => {
      contract = new Contract(
        getEcocRPCAddress(),
        ContractMetadata.SimpleContract.address,
        ContractMetadata.SimpleContract.abi,
      );
      assert.isDefined(contract.rpcProvider);
      assert.isDefined(contract.amount);
      assert.isDefined(contract.gasLimit);
      assert.isDefined(contract.gasPrice);
      assert.equal(contract.address, ContractMetadata.SimpleContract.address);
      assert.equal(contract.abi, ContractMetadata.SimpleContract.abi);
    });

    it('removes the hex prefix from the address', async () => {
      contract = new Contract(getEcocRPCAddress(), '0x1234567890', ContractMetadata.SimpleContract.abi);
      assert.equal(contract.address, '1234567890');
    });
  });

  describe('call()', () => {
    it('returns the values', async () => {
      const result = {
        address: '09223575cc86e0c7d42f3b16f20fceb2caef828b',
        executionResult: {
          gasUsed: 26859,
          excepted: 'None',
          newAddress: '09223575cc86e0c7d42f3b16f20fceb2caef828b',
          output: '0000000000000000000000000000000000000000000000000000000005f5e100',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'b1121cfe67b3c73e95e9aa8d8e7a95ecff7395f225016b07a862d8fdc6938aef',
          gasUsed: 26859,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const formatted = Decoder.decodeCall(result, ContractMetadata.BCSToken.abi, 'totalSupply', true);
      assert.isDefined(formatted.executionResult.formattedOutput[0]);
      assert.isTrue(_.every(formatted.executionResult.formattedOutput, item => Web3Utils.isBN(item)));
      assert.equal(formatted.executionResult.formattedOutput[0].toString(16), new BN('100000000').toString(16));
    });
  });

  describe('send()', () => {
    it('sends a transaction', async () => {
      const res = {
        txid: '5f6e2acbc80394d24fd5e0008c261c4072b67ee00475c3ed029f9da10f02bd14',
        sender: 'e69DJeDf2Fse48kxdtHzDAorSL2ohwH1VK',
        hash160: '2c6428dba3de3074c999344041e68d96e4007d00',
      };

      assert.isDefined(res.txid);
      assert.isDefined(res.sender);
      assert.isDefined(res.hash160);
    });

    it('returns the args object with the sent params', async () => {
      const res = {
        txid: '5f6e2acbc80394d24fd5e0008c261c4072b67ee00475c3ed029f9da10f02bd14',
        sender: 'e69DJeDf2Fse48kxdtHzDAorSL2ohwH1VK',
        hash160: '2c6428dba3de3074c999344041e68d96e4007d00',
        args: {
          contractAddress: '08724b1f8b6beb00f82101c986603837f36e9c61',
          amount: 0,
          gasLimit: 250000,
          gasPrice: 4e-7,
        },
      };

      assert.isString(res.args.contractAddress);
      assert.isNumber(res.args.amount);
      assert.isNumber(res.args.gasLimit);
      assert.isNumber(res.args.gasPrice);
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
