/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";
import './list.css';
import { getContentByCid } from '../../utils/util';
export default function List() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    useEffect(()=>{
        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            const account = wallet.account()
            const res = await account.viewFunction(config.CONTRACT, "get_question", {account_id: localStorage.getItem("accountId")})
            
            const list = [];
            for (let i = 0; i < res.length; i++){
                let content = getContentByCid(res[i])
                let question = (await content).data
                console.log(question,'-------')
                list.push({...question,question_hash:res[i]});
            }
            setList(list);
        })();
        return () => {
        }
    },[])

    const toAsk = () => {
        navigate('/question');
    }

    const toDetail = (id) => {
        navigate(`/detail/${id}`);
    }

    function SetList(){
        if(list.length>0){
            const setItems = list.map((item,index) => 
                <div className={"question-item"} key={Math.random()} onClick={() => toDetail(item.question_hash)}>
                    <div className={"title"}>{item.question}</div>
                    <div className={"description"}>{item.description}</div>
                    <div className={"info"}>
                        <div className={"account"}>creator: <span>XX.testnet</span></div>
                        <div className={"rewards"}>rewards: <span>{item.rewards}near</span></div>
                    </div>
                </div>
            );
            
            return (<div className={'question-list'}>
                {setItems}
            </div>)
        }
        else{
            return (<div className={'no-data'}>
                <div className={'tip'}>No data</div>
            </div>)
        }
    }

    return <div className={"wrap"}>
        <div className={"fixed-btn"} onClick={toAsk}>ask</div>
        <div className={"page-title"}>Question list</div>
        <SetList/>
    </div>
}
