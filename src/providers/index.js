const { includes } = require('lodash');

const HttpProvider = require('./http-provider');
const ApiProvider = require('./api-provider');

const compatibleProviders = [
  'HttpProvider',
  'ApiProvider',
];

const initProvider = (provider) => {
  if (!provider) {
    throw Error('Provider cannot be undefined.');
  }

  if (typeof provider === 'string') {
    return new HttpProvider(provider);
  }

  const className = provider.constructor.name;
  if (!includes(compatibleProviders, className)) {
    throw Error(`Incompatible provider: ${className}`);
  }

  return provider;
};

const initApiProvider = (provider, prefix) => {
  if (!provider) {
    throw Error('Provider cannot be undefined.');
  }
  const apiPrefix = (prefix === undefined) ? '/api' : prefix;

  if (typeof provider === 'string') {
    return new ApiProvider(provider, apiPrefix);
  }

  const className = provider.constructor.name;
  if (!includes(compatibleProviders, className)) {
    throw Error(`Incompatible provider: ${className}`);
  }

  return provider;
};

module.exports = { initProvider, initApiProvider };
