import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {connect, WalletConnection} from 'near-api-js';
import config from "./config";
(async ()=>{
    const near = await connect(config);
    const wallet = new WalletConnection(near, 'demo');
    if (wallet.isSignedIn()) {
        localStorage.setItem("isSign",true);
        localStorage.setItem("accountId", wallet.getAccountId());
    }
})();
ReactDOM.render(<App />, document.getElementById('root'));