/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";
import './list.css';
export default function List() {
    const [list, setList] = useState([]);
    useEffect(()=>{
        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            const account = wallet.account()
            const res = await account.viewFunction(config.CONTRACT, "get_question", {account_id: localStorage.getItem("accountId")})
            console.log('list:',res);
            setList(res);
        })();
    })

    return <div className={"wrap"}>
        <div className={"page-title"}>Question list</div>
        <div className={"question-list"}>
            <div className={"question-item"}>
                <div className={"title"}>问题描述</div>
                <div className={"description"}>description</div>
                <div className={"info"}>
                    <div className={"account"}>creator: <span>XX.testnet</span></div>
                    <div className={"rewards"}>rewards: <span>0.5near</span></div>
                </div>
            </div>
        </div>
    </div>
}
