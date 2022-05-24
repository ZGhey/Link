/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Select, Space} from "antd";
import './question.css';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";


export default function Question(props) {
    const [form] = Form.useForm();

    useEffect(()=>{
        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.CONTRACT)
            }
        })();
    })

    const submit = () => {

    }
    return (
        <div className={"wrap"}>
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
                    <Input.TextArea showCount={false} maxLength={500}  autoSize={{ minRows: 3}} bordered={false} placeholder="Provide a detailed description of your item."/>
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
            <div className={'submit'} onClick={submit}>submit</div>
        </div>
    )
}
