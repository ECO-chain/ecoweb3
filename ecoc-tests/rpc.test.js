require('dotenv').config({ path: '../.env' });

const chai = require('chai');
const { initRPC } = require('../src/providers');
const RpcProvider = require('../src/providers/rpc-provider');
const Decoder = require('../src/formatters/decoder');

const { assert } = chai;

describe('Providers', () => {
  describe('initRPC', () => {
    it('accepts a url string', () => {
      const instance = initRPC(process.env.NODE_RPC);
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'RpcProvider');
    });


    it('accepts an RpcProvider', () => {
      const instance = initRPC(new RpcProvider(process.env.NODE_RPC));
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'RpcProvider');
    });

    it('throws if not a compatible provider', () => {
      assert.throws(() => initRPC(new Decoder()));
    });
  });
});
