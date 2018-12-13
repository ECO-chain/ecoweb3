require('dotenv').config();

module.exports = {
  /**
   * Returns the default ecochain address
   * @return {String} Default ecochain address
   */
  getDefaultEcocAddress: () => {
    if (!process.env.SENDER_ADDRESS) {
      throw Error('Must have SENDER_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS));
  },

  /**
   * Returns the default ecochain address's privatekey
   * @return {String} Default ecochain address's privatekey
   */
  getDefaultEcocPrivKey: () => {
    if (!process.env.SENDER_ADDRESS_PRIV) {
      throw Error('Must have SENDER_ADDRESS_PRIV in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS_PRIV));
  },

  /**
   * Returns the ecochain network RPC url
   * @return {String} The ecochain network RPC url
   */
  getEcocRPCAddress: () => {
    if (!process.env.ECOC_RPC_ADDRESS) {
      throw Error('Must have ECOC_RPC_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.ECOC_RPC_ADDRESS));
  },

  /**
   * Returns the ecochain network API url
   * @return {String} The ecochain network API url
   */
  getEcocAPIAddress: () => {
    if (!process.env.ECOC_API_ADDRESS) {
      throw Error('Must have ECOC_API_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.ECOC_API_ADDRESS));
  },

  /**
   * Returns the wallet passphrase to unlock the encrypted wallet
   * @return {String} The wallet passphrase
   */
  getWalletPassphrase: () => (process.env.WALLET_PASSPHRASE ? String(Buffer.from(process.env.WALLET_PASSPHRASE)) : ''),

  isWalletEncrypted: async (ecocw3) => {
    const res = await ecocw3.rpc.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
