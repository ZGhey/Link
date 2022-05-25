import "./App.css";
import React from 'react';
// import BN from 'bn.js';
import * as nearAPI from 'near-api-js'
const ContractName = 'dev-1653406821132-91431409179529';

class App extends React.Component {
  async _initNear() {
    const nearConfig = {
      networkId: 'default',
      nodeUrl: 'https://rpc.testnet.near.org',
      contractName: ContractName,
      walletUrl: 'https://wallet.testnet.near.org',
    };
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, nearConfig));
    this._keyStore = keyStore;
    this._nearConfig = nearConfig;
    this._near = near;

    this._walletConnection = new nearAPI.WalletConnection(near, ContractName);
    this._accountId = this._walletConnection.getAccountId();

    this._account = this._walletConnection.account();
    this._contract = new nearAPI.Contract(this._account, ContractName, {
      viewMethods: ['get_question','get_answer'],
      changeMethods: ['set_question', 'set_answer','send_bonus'],
    });
  }

  async requestSignIn() {
    const appTitle = 'Link';
    await this._walletConnection.requestSignIn(
        ContractName,
        appTitle
    )
  }

  async logOut() {
    this._walletConnection.signOut();
    this._accountId = null;
    this.setState({
      signedIn: !!this._accountId,
      accountId: this._accountId,
    })
  }

  render() {
    const content = !this.state.connected ? (
      <div>Connecting... <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></div>
  ) : (this.state.signedIn ? (
      <div>
        <div className="float-right">
          <button
            className="btn btn-outline-secondary"
            onClick={() => this.logOut()}>Log out</button>
        </div>
        <h4>Hello, <span className="font-weight-bold">{this.state.accountId}</span>!</h4>
      </div>
  ) : (
      <div style={{marginBottom: "10px"}}>
        <button
            className="btn btn-primary"
            onClick={() => this.requestSignIn()}>Log in with NEAR Wallet</button>
      </div>
  ));
  return (
    <div className="px-5">
      <h1>Link</h1>
      {content}
      <div>
        <canvas ref={this.canvasRef}
                width={800}
                height={800}
                className={this.state.boardLoaded ? "pixel-board" : "pixel-board c-animated-background"}>

        </canvas>
      </div>
    </div>
  );
  }
}

export default App;