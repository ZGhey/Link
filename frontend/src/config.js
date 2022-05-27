import {keyStores} from 'near-api-js';
const key = new keyStores.BrowserLocalStorageKeyStore();

const config = {
  networkId: 'testnet',
  keyStore: key,
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  CONTRACT: 'dev-1653625243868-83124057301145',
}
export default config;
