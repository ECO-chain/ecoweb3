require('dotenv').config({ path: '../.env' });

const Ecoweb3 = require('../src/ecoweb3');

const config = { rpcProvider: process.env.NODE_RPC };
const ecocw3 = new Ecoweb3(config);
const unhandledRejections = new Map();

process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});

async function isConnected() {
  return ecocw3.rpc.isConnected();
}

async function fromHexAddress() {
  return ecocw3.rpc.fromHexAddress('4c6db75320e90d3b1e01c6265da17b2a9ca18a1a');
}

async function getHexAddress() {
  return ecocw3.rpc.getHexAddress('e94cNn97bstf7tALWR5YhAFEcQTyJ9LGYF');
}


async function getBlockCount() {
  return ecocw3.rpc.getBlockCount();
}

isConnected().then((res) => {
  if (res) {
    console.log('Connected without problems');
  } else {
    console.log('Connection error:');
  }
});

getBlockCount().then((res, error) => {
  if (res) {
    console.log(`current block height:${res}`);
  } else {
    console.log(`Connection error: ${error}`);
  }
});

fromHexAddress().then((res, error) => {
  if (res) {
    console.log(`publickey: ${res}`);
  } else {
    console.log(`Connection error: ${error}`);
  }
});

getHexAddress().then((res, error) => {
  if (res) {
    console.log(`address: ${res}`);
  } else {
    console.log(`Connection error: ${error}`);
  }
});
