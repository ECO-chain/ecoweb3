require('dotenv').config({ path: '../.env' });

const chai = require('chai');
const { initProvider } = require('../src/providers');
const HttpProvider = require('../src/providers/http-provider');
const Decoder = require('../src/formatters/decoder');

const { assert } = chai;

describe('Providers', () => {
  describe('initProvider', () => {
    it('accepts a url string', () => {
      const instance = initProvider(process.env.NODE_RPC);
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'HttpProvider');
    });


    it('accepts an HttpProvider', () => {
      const instance = initProvider(new HttpProvider(process.env.NODE_RPC));
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'HttpProvider');
    });

    it('throws if not a compatible provider', () => {
      assert.throws(() => initProvider(new Decoder()));
    });
  });
});
