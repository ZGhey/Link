/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Form, Input} from "antd";
import { useNavigate } from 'react-router-dom';
import './detail.css';
import {connect, WalletConnection} from 'near-api-js';
import config from "../../config";
import {parseAmount, getCid, formatAmount} from "../../utils/util";
import { useParams, useHistory } from 'react-router-dom';
import { getContentByCid } from '../../utils/util';


export default function Detail(props) {
    const navigate = useNavigate();
    const params = useParams()
    const [form] = Form.useForm();
    const [isLoading, setLoading] = useState(false);
    const [detail, setDetail] = useState({});
    const [answerList, setAnswerList] = useState([]);
    useEffect(()=>{
        (async ()=>{
            // getDetail()
            const res  = await getContentByCid(params.id);
            setDetail(res.data);
            await getList();
        })();
    },[])

    const sendBonus = async (account_id) => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        const account = wallet.account()
        const res = await account.functionCall(
            config.CONTRACT,
            'send_bonus',
            {bonus: Number(detail.rewards),account_id:account_id},
            '300000000000000',
            ''
        );
        if(res.transaction){
            form.resetFields();
            getList();
        }
        // const res = await account.viewFunction(config.CONTRACT, "send_bonus", {bonus: parseAmount(detail.rewards),account_id:account_id})
    };

    const getList = async (item) => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'demo');
        const account = wallet.account()
        const res = await account.viewFunction(config.CONTRACT, "get_answer", {question_hash: params.id}) //params.id
        console.log('res:',res,params.id);

        const list = [];
        for (let i = 0; i < res.length; i++){
            let content = getContentByCid(res[i])
            let answer = (await content).data
            list.push(answer);
        }
        setAnswerList(list);
        console.log('answerList:',list);
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
                creator:localStorage.getItem("accountId")
            }
            
            const cid = (await getCid(JSON.stringify(args))).path;
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'demo');
            const account = wallet.account()
            const res = await account.functionCall(
                config.CONTRACT,
                'set_answer',
                {answer_hash:cid,question_hash:params.id}, //params.id
                '300000000000000',
                '0'
            );
            if(res.transaction){
                form.resetFields();
                getList();
            }
        }catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const jump = (path) => {
        navigate(path);
    }

    function Button(props){
        if(detail.creator == localStorage.getItem("accountId")){
            return <div className={"bottom"}>
                <div className={"reward-btn"} onClick={() => sendBonus(props.item.creator)}>reward</div>
            </div>
        }else{
            return ""
        }
    }
    
    function SetList(){
        if(answerList.length>0){
            const setItems = answerList.map((item,index) => 
                <div className={"answer-item"} key={Math.random()}>
                     <div className={"top"}>
                        <div className={"user"}>{item.creator}</div>
                        {/* <div className={"date"}>2022/05/23</div> */}
                    </div>
                    <div className={"text"}>{item.answer}</div>
                        
                    <Button item={item} />
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

    return <div className={"wrap detail"}>
        <div className={"fixed-btn fixed-btn1"} onClick={() => jump('/question')}>ask</div>
        <div className={"fixed-btn "} onClick={() => jump('/list')}>list</div>
        <div className={"question-item"}>
            <div className={"title"}>{detail.question}</div>
            <div className={"description"}>{detail.description}</div>
            <div className={"info"}>
                <div className={"account"}>creator: <span>{detail.creator}</span></div>
                <div className={"rewards"}>rewards: <span>{detail.rewards}near</span></div>
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
            <SetList/>
        </div>
    </div>
}
