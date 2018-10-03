/* eslint-disable no-underscore-dangle, max-len */
const chai = require('chai');

const Decoder = require('../src/formatters/decoder');
const ContractMetadata = require('../test/data/contract_metadata');

const { assert, expect } = chai;

describe('Decoder', () => {
  describe('toEcoAddress()', () => {
    it('returns the converted ecochain address', () => {
      assert.equal(
        Decoder.toEcoAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3', false),
        'e4GtVd6pJXCN38pXDtyjaKdw4hNm3yfmTw',
      );
      assert.equal(
        Decoder.toEcoAddress('2a2ad24849bc061f0f7abee243ebdb584b0d11f1', true),
        'ELzsAvcbRW9ryh8UgNYBmFTk3AgFx8ho9Q',
      );
    });

    it('throws if hexAddress is undefined or empty', () => {
      expect(() => Decoder.toEcoAddress()).to.throw();
      expect(() => Decoder.toEcoAddress('')).to.throw();
    });

    it('throws if hexAddress is not hex', () => {
      expect(() => Decoder.toEcoAddress('eB2v8BPvqbtJMYWonhyCpdB7aUcXNxdx6Z')).to.throw();
    });
  });

  describe('removeHexPrefix()', () => {
    it('returns the value without the hex prefix', () => {
      const hexValue = '0x1111111111111111111111111111111111111111';
      assert.equal(Decoder.removeHexPrefix(hexValue), hexValue.slice(2));
    });

    it('returns the array values with hex prefixes', () => {
      const hexArray = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'];
      const expected = [hexArray[0].slice(2), hexArray[1].slice(2)];
      assert.deepEqual(Decoder.removeHexPrefix(hexArray), expected);
    });
  });

  describe('decodeCall()', () => {
    let rawOutput = {
      address: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
      executionResult: {
        gasUsed: 21720,
        excepted: 'None',
        newAddress: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
        output: '0000000000000000000000000000000000000000000000000000000005f5e100',
        codeDeposit: 0,
        gasRefunded: 0,
        depositSize: 0,
        gasForDeposit: 0,
      },
      transactionReceipt: {
        stateRoot: 'e6dfdcb1a7b722f39cf036d681ff76637f556447a8dea0d29f05b83df82d9cc0',
        gasUsed: 21720,
        bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        log: [],
      },
    };

    it('returns the formattedOutput in the object', () => {
      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.BCSToken.abi, 'totalSupply');
      assert.isDefined(decoded.executionResult.formattedOutput);
    });

    // fix me
    it('returns the formatted call output for a struct', () => {
      assert.equal(true, true);
    });

    it('returns the formatted call output for uint', () => {
      rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22303,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '0000000000000000000000000000000000000000000000000000000000000004',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22303,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.BCSToken.abi, 'balanceOf', true);
      assert.equal(decoded.executionResult.formattedOutput[0], 4);
    });

    // fix me
    it('returns the formatted call output for address', () => {
      assert.equal(true, true);
    });

    it('throws if rawOutput, contractABI, or methodName is undefined', () => {
      expect(() => Decoder.decodeCall(undefined, ContractMetadata.noContract.abi, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, undefined, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, ContractMetadata.noContract.abi, undefined)).to.throw();
    });
  });

  describe('decodeSearchLog()', () => {
    const rawOutput = [
      {
        blockHash: 'aa39205a03eb789f00fe5a17412a2a6ce4e7586522827a4e4f5a3bca6d578d89',
        blockNumber: 5292,
        transactionHash: 'de82f3ed77cf3c0a45ef379c7d581a062db6ab1b8a4292e2ea5589590258d23d',
        transactionIndex: 2,
        from: '2c6428dba3de3074c999344041e68d96e4007d00',
        to: '08724b1f8b6beb00f82101c986603837f36e9c61',
        cumulativeGasUsed: 53241,
        gasUsed: 53241,
        contractAddress: '08724b1f8b6beb00f82101c986603837f36e9c61',
        excepted: 'None',
        log: [
          {
            address: '08724b1f8b6beb00f82101c986603837f36e9c61',
            topics: [
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0000000000000000000000002c6428dba3de3074c999344041e68d96e4007d00',
              '000000000000000000000000620bf38761a1ae8a8c74516248b25217d8876206',
            ],
            data: '00000000000000000000000000000000000000000000000000005af3107a4000',
          },
        ],
      },
    ];

    it('returns the formatted searchlog output Tranfer Event', () => {
      const formatted = Decoder.decodeSearchLog(rawOutput, ContractMetadata, true);

      const log0 = formatted[0].log[0];

      assert.equal(log0._eventName, 'Transfer');
      assert.equal(log0.from, '2c6428dba3de3074c999344041e68d96e4007d00');
      assert.equal(log0.to, '620bf38761a1ae8a8c74516248b25217d8876206');
      assert.equal(log0.value.toString(10), '100000000000000');
    });

    it('skips decoding for an invalid eventName', () => {
      const withdrawWinningsOutput = [
        {
          blockHash: 'aa39205a03eb789f00fe5a17412a2a6ce4e7586522827a4e4f5a3bca6d578d89',
          blockNumber: 5292,
          transactionHash: 'de82f3ed77cf3c0a45ef379c7d581a062db6ab1b8a4292e2ea5589590258d23d',
          transactionIndex: 2,
          from: '2c6428dba3de3074c999344041e68d96e4007d00',
          to: '08724b1f8b6beb00f82101c986603837f36e9c61',
          cumulativeGasUsed: 53241,
          gasUsed: 53241,
          contractAddress: '08724b1f8b6beb00f82101c986603837f36e9c61',
          excepted: 'None',
          log: [
            {
              address: '08724b1f8b6beb00f82101c986603837f36e9c61',
              topics: [
                'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0000000000000000000000002c6428dba3de3074c999344041e68d96e4007d00',
                '000000000000000000000000620bf38761a1ae8a8c74516248b25217d8876206',
              ],
              data: '00000000000000000000000000000000000000000000000000005af3107a4000',
            },
          ],
        },
      ];

      const formatted = Decoder.decodeSearchLog(withdrawWinningsOutput, ContractMetadata, true);
      assert.isDefined(formatted[0].log[0]._eventName);
      assert.isDefined(formatted[0].log[0].from);
      assert.isDefined(formatted[0].log[0].to);
      assert.isDefined(formatted[0].log[0].value);
      assert.isUndefined(formatted[0].log[0]._contractAddress);
      assert.isUndefined(formatted[0].log[0]._eventAddress);
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
