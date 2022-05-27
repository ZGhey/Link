/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Form, Input} from "antd";
import './question.css';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";
import {parseAmount, getCid} from "../../utils/util";
import BN from 'bn.js';


export default function Question(props) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [wallet, setWallet] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(()=>{
        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            setWallet(wallet);
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.CONTRACT)
            }
        })();
    })

    const sub = async () => {
        try{
            const values = await form.validateFields();
            const args = {
                question:values.question,
                description:values.description,
                rewards:values.rewards,
                creator:localStorage.getItem("accountId")
            }
            const cid = (await getCid(JSON.stringify(args))).path;
            const deposit = new BN(parseAmount(values.rewards)).add(new BN('20000000000000000000000'))
            const account = wallet.account()
            await account.functionCall(
                config.CONTRACT,
                'set_question',
                {question_hash:cid},
                '300000000000000',
                deposit.toString(),
            );
            
        }catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
        
    }

    const toList = () => {
        navigate('/list');
    }


    return (
        <div className={"wrap"}>
            <div className={"fixed-btn"} onClick={toList}>list</div>
            <div className={"page-title"}>Create a question</div>
            <Form
                form={form}
                name="basic"
                autoComplete="off"
            >
                <Form.Item
                    label="Question"
                    name="question"
                    rules={[{ required: true, message: 'Enter your question' }]}
                >
                    <Input.TextArea showCount={false} maxLength={500}  autoSize={{ minRows: 2}} bordered={false} placeholder="Enter your question."/>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Enter your description' }]}
                >
                    <Input.TextArea showCount={false} maxLength={500}  autoSize={{ minRows: 4}} bordered={false} placeholder="Enter your description."/>
                </Form.Item>
                <Form.Item
                    label="Rewards(near)"
                    name="rewards"
                    rules={[
                        () => ({
                            validator(_, val) {
                                if(!val || (val>=0)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Minimum Rewards is 0');
                            }
                        })
                    ]}
                >
                    <Input type="number" bordered={false} placeholder="Reward amount"/>
                </Form.Item>
            </Form>
            <div className={['submit',isLoading ? 'gray' : ''].join(' ')} onClick={sub}>submit</div>
        </div>
    )
}
