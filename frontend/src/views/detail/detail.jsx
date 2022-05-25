/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Form, Input} from "antd";
import './detail.css';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";
import {parseAmount, getCid} from "../../utils/util";
import { useParams, useHistory } from 'react-router-dom';


export default function Detail(props) {
    const [form] = Form.useForm();
    const [isLoading, setLoading] = useState(false);
    const params = useParams()

    const [detail, setDetail] = useState(null);
    const [answerList, setAnswerList] = useState([]);
    useEffect(()=>{
        (async ()=>{
            //getDetail()
            await getList();
        })();
    })

    const sendBonus = async() => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        const account = wallet.account()
        const res = await account.viewFunction(config.CONTRACT, "send_bonus", {question_hash: params.id,account_id:''})
    };

    const getList = async (item) => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        const account = wallet.account()
        const res = await account.viewFunction(config.CONTRACT, "get_answer", {question_hash: "QmS6BdhgKcQtWTgMFJvCd7RpW8yaJNFZcyX5RExXQ9AHjW"}) //params.id
        console.log('answerList:',res);
        setAnswerList(res);
    };


    const signIn = async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        wallet.requestSignIn(config.CONTRACT)// contract requesting access
    };
    const sub = async () => {
        if(!localStorage.getItem("isSign")){signIn()}
        try{
            const values = await form.validateFields();
            const args = {
                answer:values.answer,
            }
            
            const cid = (await getCid(JSON.stringify(args))).path;
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            const account = wallet.account()
            const res = await account.functionCall(
                config.CONTRACT,
                'set_answer',
                {answer_hash:cid,question_hash:"QmS6BdhgKcQtWTgMFJvCd7RpW8yaJNFZcyX5RExXQ9AHjW"}, //params.id
                '300000000000000',
                '0',
            );
            if(res.transaction){
                form.resetFields();
                getList();
            }
        }catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }


    return <div className={"wrap detail"}>
        <div className={"question-item"}>
            <div className={"title"}>问题描述</div>
            <div className={"description"}>description</div>
            <div className={"info"}>
                <div className={"account"}>creator: <span>XX.testnet</span></div>
                <div className={"rewards"}>rewards: <span>0.5near</span></div>
            </div>
        </div>
        <div className={"form-box"}>
            <Form
                form={form}
                name="basic"
                autoComplete="off"
            >
                <Form.Item
                    name="answer"
                    rules={[{ required: true, message: 'Enter your answer' }]}
                >
                    <Input.TextArea showCount={false} maxLength={500}  autoSize={{ minRows: 2}} bordered={false} placeholder="Enter your answer."/>
                </Form.Item>
            </Form>
            <div className={['submit',isLoading ? 'gray' : ''].join(' ')} onClick={sub}>submit</div>
        </div>

        <div className={"answer-list"}>
            <div className={"answer-item"}>
                <div className={"top"}>
                    <div className={"user"}>XXX.near</div>
                    <div className={"date"}>2022/05/23</div>
                </div>
                <div className={"text"}>this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. </div>
                    
                <div className={"bottom"}>
                    <div className={"reward-btn"} onClick={sendBonus}>reward</div>
                </div>
            </div>
            <div className={"answer-item"}>
                <div className={"top"}>
                    <div className={"user"}>XXX.near</div>
                    <div className={"date"}>2022/05/23</div>
                </div>
                <div className={"text"}>this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. </div>
                    
                <div className={"bottom"}>
                    <div className={"reward-btn"} onClick={sendBonus}>reward</div>
                </div>
            </div>
            <div className={"answer-item"}>
                <div className={"top"}>
                    <div className={"user"}>XXX.near</div>
                    <div className={"date"}>2022/05/23</div>
                </div>
                <div className={"text"}>this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. this is answer. </div>
                    
                <div className={"bottom"}>
                    <div className={"reward-btn"} onClick={sendBonus}>reward</div>
                </div>
            </div>
        </div>
    </div>
}
