require('dotenv').config({ path: '../.env' });

const chai = require('chai');
const { initRPC } = require('../src/providers');
const RpcProvider = require('../src/providers/rpc-provider');
const Decoder = require('../src/formatters/decoder');

const { assert } = chai;

describe('RpcProviders', () => {
  describe('initRPC', () => {
    it('accepts a url string', () => {
      const instance = initRPC(process.env.ECOC_RPC_ADDRESS);
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'RpcProvider');
    });

    it('accepts an RpcProvider', () => {
      const instance = initRPC(new RpcProvider(process.env.ECOC_RPC_ADDRESS));
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'RpcProvider');
    });

    it('throws if not a compatible provider', () => {
      assert.throws(() => initRPC(new Decoder()));
    });
  });
});
