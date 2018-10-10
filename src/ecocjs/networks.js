module.exports = {
  ecoc: {
    messagePrefix: '\x15Ecoc Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x21, // ecoc changed to E
    scriptHash: 0x32,
    wif: 0x80,
  },
  ecoc_testnet: {
    messagePrefix: '\x15Ecoc Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x5c, // ecoc changed to e
    scriptHash: 0x6e,
    wif: 0xef,
  },
};
