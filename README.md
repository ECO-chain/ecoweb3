# ecoweb3.js - web3js for ecochain

This a library can be used from developers to interract with the ecochain. it is a modification of web3 js to work for ecochain

https://www.npmjs.com/package/ecoweb3

## Get Started
Run the following in your project folder:

	npm install ecoweb3 --save

## Ecoweb3.js
Instantiate a new instance of `Ecoweb3`: 
```
const Ecoweb3 = require('ecoweb3');

// set the correct RPC port
// in the node config file set server=1. If not, set rpcbind=0.0.0.0 (or a mask). Also set rpcuser, rpcpassword, rpcport and rpcallowip
const ecocw3 = new Ecoweb3('http://rpcuser:rpcpassword@eco.no.de.ip:rpc-port');
```

## Methods of Ecoweb3 class##
### isConnected()

Checks if the attempet connection to eco node was successful or not.
```
async function isConnected() {
  return await ecocw3.isConnected();
}
```

### getHexAddress(address)
Converts an ecochain address to hex format.
```
async function getHexAddress() {
  return await ecocw3.getHexAddress('eELfUyry7GkMVi7xNjq9zpuYbKbRsa6Hdg');
}
```

### fromHexAddress(hexAddress)
Converts a hex address to ecochain format.
```
async function fromHexAddress() {
  return await ecocw3.fromHexAddress('864f980d88cdfb44a2e3293ecc01084e6d686e7a');
}
```

### getBlockCount()
Gets the current block height of the ecochain node.
```
async function getBlockCount() {
  return await ecocw3.getBlockCount();
}
```

### getTransaction(txid)
Gets the transaction details of the transaction id.
```
async function getTransaction(args) {
  const {
    transactionId, // string
  } = args;

  return await ecocw3.getTransactionReceipt(transactionId);
}
```

### getTransactionReceipt(txid)
Gets the transaction receipt of the transaction id.
```
async function getTransactionReceipt(args) {
  const {
    transactionId, // string
  } = args;

  return await ecoweb3.getTransactionReceipt(transactionId);
}
```

### listUnspent()
Gets the unspent outputs that can be used.
```
async function listUnspent() {
  return await ecocw3.listUnspent();
}
```

### searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix)
Gets the logs given the params on the blockchain.

The `contractMetadata` param contains the contract names and ABI that you would like to parse. An example of one is:

Usage:
```
const ContractMetadata = require('./contract_metadata');

async function(args) {
  let {
    fromBlock, // number
    toBlock, // number
    addresses, // string array
    topics // string array
  } = args;

  if (addresses === undefined) {
    addresses = [];
  }
  if (topics === undefined) {
    topics = [];
  }

  // removeHexPrefix = true removes the '0x' hex prefix from all hex values
  return await ecoweb3.searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, true);
}
```

## Contract.js
Instantiate a new instance of `Contract`: 
```
const { Ecoweb3 } = require('ecoweb3');

const ecoweb3 = new Ecoweb3('http://rpcuser:rpcpassword@eco.no.de.ip:rpc-port');

// contractAddress = The address of your contract deployed on the blockchain
const contractAddress = 'f7b958eac2bdaca0f225b86d162f263441d23c19';

// contractAbi = The ABI of the contract
const contractAbi = [{
        constant: true,
        inputs: [
          {
            name: 'a',
            type: 'uint256',
          },
          {
            name: 'b',
            type: 'uint256',
          },
        ],
        name: 'add',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      }]

// Create a Contract instance from the Ecoweb3 instance
const contract = ecoweb3.Contract(contractAddress, contractAbi);
```

### call(methodName, params)
Executes a `callcontract`
```
// callcontract on a method named 'bettingEndBlock'
async function exampleCall(args) {
  const {
    senderAddress, // address
  } = args;

  return await contract.call('add', {
    methodArgs: [5,5],
    senderAddress: senderAddress,
  });
}
```

### send(methodName, params)
Executes a `sendtocontract`
```
// sendtocontract on a method named 'setResult'
async function exampleSend(args) {
  const {
    resultIndex, // number
    senderAddress, // address
  } = args;

  return await contract.send('setResult', {
    methodArgs: [resultIndex],
    gasLimit: 1000000, // setting the gas limit to 1 million
    senderAddress: senderAddress,
  });
}
```

## Encoder
`Encoder` static functions are exposed in Ecoweb3 instances.
```
const { Ecoweb3 } = require('ecoweb3');

const ecoweb3 = new Ecoweb3('http://rpcuser:rpcpassword@eco.no.de.ip:rpc-port');
ecoweb3.encoder.objToHash(abiObj, isFunction);
ecoweb3.encoder.addressToHex(address);
ecoweb3.encoder.boolToHex(value);
ecoweb3.encoder.intToHex(num);
ecoweb3.encoder.uintToHex(num);
ecoweb3.encoder.stringToHex(string, maxCharLen);
ecoweb3.encoder.stringArrayToHex(strArray, numOfItems);
ecoweb3.encoder.padHexString(hexStr);
ecoweb3.encoder.constructData(abi, methodName, args);
```

## Decoder
`Decoder` static functions are exposed in Ecoweb3 instances.
```
const Ecoweb3 = require('ecoweb3');

const ecow3 = new Ecoweb3('http://rpcuser:rpcpassword@eco.no.de.ip:rpc-port');
ecow3.decoder.toEcoAddress(hexAddress, isMainnet);
ecow3.decoder.removeHexPrefix(value);
ecow3.decoder.decodeSearchLog(rawOutput, contractMetadata, removeHexPrefix);
ecow3.decoder.decodeCall(rawOutput, contractABI, methodName, removeHexPrefix);
```

## Utils
`Utils` static functions are exposed in Ecoweb3 instances.
```
const Ecoweb3 = require('ecoweb3');

const ecow3 = new Ecoweb3('http://rpcuser:rpcpassword@eco.no.de.ip:rpc-port');
ecow3.utils.paramsCheck(methodName, params, required, validators);
ecow3.utils.appendHexPrefix(value);
ecow3.utils.trimHexPrefix(str);
ecow3.utils.chunkString(str, length);
ecow3.utils.toUtf8(hex);
ecow3.utils.fromUtf8(str);
ecow3.utils.isJson(str);
ecow3.utils.isEcoAddress(address);
```

### Network
```
{
    ecoc: {
        messagePrefix: '\x15Ecoc Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x21, //ecoc changed to E
        scriptHash: 0x32,
        wif: 0x80
    },
    ecoc_testnet: {
        messagePrefix: '\x15Ecoc Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x5c,  //ecoc changed to e
        scriptHash: 0x6e,
        wif: 0xef
    }
}
```

## Running Tests
You must set the following variables inside the test scripts or you can create a `.env` file in the root folder of the project.
```
NODE_RPC
SENDER_ADDRESS
WALLET_PASSPHRASE
```
