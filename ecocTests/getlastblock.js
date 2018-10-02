require('dotenv').config({ path: '../.env' });

const Ecoweb3 = require('../src/ecoweb3');

const ecocw3 = new Ecoweb3(process.env.NODE_RPC);

async function getBlockCount() {
  return await ecocw3.getBlockCount();
}

let r = getBlockCount().then(function(result) {
   console.log(result)
});
