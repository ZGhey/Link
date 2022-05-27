use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::{Base58PublicKey, U128};
use near_sdk::{env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise};

pub mod question;
pub use crate::question::*;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc<'_> = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Link {
    pub issuser: UnorderedMap<AccountId, Vec<Question>>,
    pub replier: UnorderedMap<AccountId, Vec<String>>,
    pub qa: UnorderedMap<String, Vec<String>>,

}

#[near_bindgen]
impl Link {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");
        let link = Self {
          issuser: UnorderedMap::new(b"i".to_vec()),
          replier: UnorderedMap::new(b"r".to_vec()),
          qa: UnorderedMap::new(b"q".to_vec()),
        };
        link
    }

    #[payable]
    pub fn set_question(&mut self, question_hash: String) -> Promise{
      let mut question = Question::new();
      question.question_hash = question_hash;
      question.is_answered = false;
      if self.issuser.get(&env::signer_account_id()).is_none(){
        
        let v = vec![question];
        self.issuser.insert(&env::signer_account_id(), &v);
      }else {
        let mut questions = self.issuser.get(&env::signer_account_id()).unwrap();
        questions.push(question);
        self.issuser.insert(&env::signer_account_id(), &questions);
      }
      return Promise::new(env::current_account_id()).transfer(env::attached_deposit());
    }

    pub fn get_question(&self, account_id: AccountId) -> Vec<String>{
      let value = self.issuser.get(&account_id);
      let mut question_hash = Vec::new();
      if value.is_none(){
        return question_hash;
      }
      let questions = self.issuser.get(&account_id).unwrap();
      for question in &questions{
        question_hash.push(question.question_hash.clone())
      }

      return question_hash;
    }

    pub fn set_answer(&mut self, question_hash: String, answer_hash: String){
      let answer_hash1 = answer_hash.clone();
      if self.replier.get(&env::signer_account_id()) == None {
        let answer_hash_list = vec![answer_hash];
        self.replier.insert(&env::signer_account_id(), &answer_hash_list);
      }else {
        let mut answers = self.replier.get(&env::signer_account_id()).unwrap();
        answers.push(answer_hash);
        self.replier.insert(&env::signer_account_id(), &answers);
      }

      if self.qa.get(&question_hash) == None {
        let answer_hash_list = vec![answer_hash1];
        self.qa.insert(&question_hash, &answer_hash_list);
      }else {
        let mut answers = self.qa.get(&question_hash).unwrap();
        answers.push(answer_hash1);
        self.qa.insert(&question_hash, &answers);
      }
    }

    pub fn get_answer(&self, question_hash: String) -> Vec<String>{
      let value = self.qa.get(&question_hash);
      if value == None{
        return Vec::new();
      }
      return self.qa.get(&question_hash).unwrap();
    }

    pub fn send_bonus(&mut self,question_hash: String, account_id: AccountId, bonus: Balance){
      let questions = self.issuser.get(&env::signer_account_id()).unwrap();
      let mut questions_vec: Vec::<Question> = Vec::new();
      for question in questions{
        if question.question_hash.clone() == question_hash{
          let mut question_obj = Question::new();
          question_obj.question_hash = question.question_hash;
          question_obj.is_answered = true;
          questions_vec.push(question_obj);
          Promise::new(account_id.clone()).transfer(bonus);
        }
        questions_vec.push(question);
      }
      self.issuser.remove(&env::signer_account_id());
      self.issuser.insert(&env::signer_account_id(), &questions_vec);
      //return Promise::new(account_id).transfer(bonus);
    }

    pub fn clear_question(&mut self){
      self.issuser.remove(&env::signer_account_id());
    }
}