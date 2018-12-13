require('dotenv').config({ path: '../.env' });

const chai = require('chai');
const { initAPI } = require('../src/providers');
const ApiProvider = require('../src/providers/api-provider');
const Decoder = require('../src/formatters/decoder');

const { assert } = chai;

describe('ApiProviders', () => {
  describe('initAPI', () => {
    it('accepts a url string', () => {
      const instance = initAPI(process.env.ECOC_API_ADDRESS);
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'ApiProvider');
    });


    it('accepts an ApiProvider', () => {
      const instance = initAPI(new ApiProvider(process.env.ECOC_API_ADDRESS));
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'ApiProvider');
    });

    it('throws if not a compatible api provider', () => {
      assert.throws(() => initAPI(new Decoder()));
    });
  });
});
