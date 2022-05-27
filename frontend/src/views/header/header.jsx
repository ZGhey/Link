/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {connect, WalletConnection} from 'near-api-js';
import './header.css';
import config from "../../config";


export default function Header() {
    
    const [isSign, setIsSign] = useState(false);
    const [accountId, setAccountId] = useState("");
    

    useEffect(()=>{
        setIsSign(localStorage.getItem("isSign"))
        setAccountId(localStorage.getItem("accountId"))
    })

    const signIn = async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        wallet.requestSignIn(config.CONTRACT)// contract requesting access
    };
    const signOut = async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        wallet.signOut()// contract requesting access
        setIsSign(false);
        setAccountId("");
        localStorage.removeItem("isSign");
        localStorage.removeItem("accountId");
    };
    
    if(isSign) {
        return <div className={"header"}>
            {accountId}
            <div onClick={signOut}>logout</div>
        </div>
    } else {
        return <div className={"header"}>
            <div onClick={signIn}>login</div>
        </div>
    }
}
