const { includes } = require('lodash');

const RpcProvider = require('./rpc-provider');
const ApiProvider = require('./api-provider');

const compatibleProviders = [
  'RpcProvider',
  'ApiProvider',
];

const initRPC = (provider) => {
  if (!provider) {
    throw Error('Provider cannot be undefined.');
  }

  if (typeof provider === 'string') {
    return new RpcProvider(provider);
  }

  const className = provider.constructor.name;
  if (!includes(compatibleProviders, className)) {
    throw Error(`Incompatible RPC provider: ${className}`);
  }

  return provider;
};

const initAPI = (provider) => {
  if (!provider) {
    throw Error('Provider cannot be undefined.');
  }

  if (typeof provider === 'string') {
    return new ApiProvider(provider);
  }

  const className = provider.constructor.name;
  if (!includes(compatibleProviders, className)) {
    throw Error(`Incompatible API provider: ${className}`);
  }

  return provider;
};

module.exports = { initRPC, initAPI };
