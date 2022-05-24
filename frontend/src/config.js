import {keyStores} from 'near-api-js';
const key = new keyStores.BrowserLocalStorageKeyStore();

const config = {
  networkId: 'testnet',
  keyStore: key,
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  CONTRACT: 'v5-app.bhc8521.testnet',
}
export default config;
