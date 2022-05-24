/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import './list.css';
export default function List() {
    return <div className={"wrap"}>
        <div className={"page-title"}>Question list</div>
        <div className={"question-list"}>
            <div className={"question-item"}>
                <div className={"title"}>问题描述</div>
                <div className={"info"}>
                    <div className={"account"}>creator: <span>XX.testnet</span></div>
                    <div className={"rewards"}>rewards: <span>0.5near</span></div>
                </div>
            </div>
        </div>
    </div>
}
