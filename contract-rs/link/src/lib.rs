use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::{Base58PublicKey, U128};
use near_sdk::{env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise};

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc<'_> = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Link {
    pub issuser: UnorderedMap<AccountId, Vec<String>>,
    pub replier: UnorderedMap<AccountId, Vec<String>>,
    pub qa: UnorderedMap<AccountId, Vec<String>>,

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
      if self.issuser.get(&env::signer_account_id()) == None {
        let v = vec![question_hash];
        self.issuser.insert(&env::signer_account_id(), &v);
      }else {
        let mut questions = self.issuser.get(&env::signer_account_id()).unwrap();
        questions.push(question_hash);
        self.issuser.insert(&env::signer_account_id(), &questions);
      }
      return Promise::new(env::current_account_id()).transfer(env::attached_deposit());
    }

    pub fn get_question(&self, account_id: AccountId){
      let questions = self.issuser.get(&account_id).unwrap();
      for question in questions {
        let log_message = format!("account_id: {}, quesion: {}", &account_id, &question);
        env::log(log_message.as_bytes());
      }
    }

    pub fn set_answer(&mut self, question_hash: String, answer_hash: String){
      let answer_hash1 = answer_hash.clone();
      if self.replier.get(&env::signer_account_id()) == None {
        let answer_hash_list = vec![answer_hash];
        self.issuser.insert(&env::signer_account_id(), &answer_hash_list);
      }else {
        let mut answers = self.issuser.get(&env::signer_account_id()).unwrap();
        answers.push(answer_hash);
        self.issuser.insert(&env::signer_account_id(), &answers);
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

    pub fn get_answer(&self, question_hash: String){
      let answers = self.qa.get(&question_hash).unwrap();
      for answer in answers {
        let log_message = format!("question_hash: {}, answer: {}", &question_hash, &answer);
        env::log(log_message.as_bytes());
      }
    }

    pub fn send_bonus(&self, account_id: AccountId, bonus: Balance) -> Promise{
      return Promise::new(account_id).transfer(bonus);
    }
}