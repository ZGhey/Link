# Link API

## set_question(&mut self, question_hash: String)
#### 提交问题，将用户ID与问题hash绑定存到链上。
```
 env.signer_account_id env自带 
 env.attetched_deposit env自带
 question_hash String类型 这个是存储完IPFS以后返回的CID
````
## get_question(&self, account_id: AccountId)
#### 获取某一个用户所有提交的问题hash
```
 account_id string 
```

## set_answer(&mut self, question_hash: String, answer_hash: String)
#### 提交答案，该方法会将question_hash与answer_hash绑定，还会将answer_hash与env::signer_account_id绑定，然后存入各自的Map中
```
 env.signer_account_id env自带 
 question_hash String类型 这个是存储完IPFS以后返回的CID
 answer_hash String, 这个是存储完IPFS以后返回的CID
```

## get_answer(&self, question_hash: String)
#### 获取某一个问题的所有答案
```
 question_hash string 
```

## send_bonus(&self, account_id: AccountId, bonus: Balance)
#### 当提问者点对勾以后，合约会将奖金发放给回复者。
```
 account_id 奖金接受者
 bonus 金额
```