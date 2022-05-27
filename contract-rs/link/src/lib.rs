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

    pub fn get_question(&self, account_id: AccountId) -> Vec<String>{
      let mut value: Vec::<String> = Vec::new();
      if account_id.is_empty(){
        for vec_questions in self.issuser.values(){
          for question in vec_questions{
            value.push(question);
          }
        }
        return value;
      }else if self.issuser.get(&account_id) == None{
        return value;
      }
      return self.issuser.get(&account_id).unwrap();
    }

    pub fn set_answer(&mut self, question_hash: String, answer_hash: String){
      let answer_hash1 = answer_hash.clone();
      if self.replier.get(&env::signer_account_id()) == None {
        let answer_hash_list = vec![answer_hash];
        self.replier.insert(&env::signer_account_id(), &answer_hash_list);
      }else {
        let mut answers = self.issuser.get(&env::signer_account_id()).unwrap();
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
      let value: Vec::<String> = Vec::new();
      if question_hash.is_empty(){
        return value;
      }else if self.qa.get(&question_hash) == None{
        return value;
      }
      return self.qa.get(&question_hash).unwrap();
    }

    pub fn send_bonus(&self, account_id: AccountId, bonus: u128) -> Promise{
      return Promise::new(account_id).transfer(bonus);
    }

    pub fn clear_question(&mut self){
      self.issuser.remove(&env::signer_account_id());
    }
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "dev-1653625243868-83124057301145".to_string(),
            signer_account_id: "0xjacktest1.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "0xjacktest1.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 1,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 0,
        }
    }

    #[test]
    fn set_get_question() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Link::new();
        contract.set_question("hello".to_string());
        assert_eq!(
            "hello".to_string(),
            contract.get_question("0xjacktest1.testnet".to_string())[0]
        );
        
    }

    #[test]
    fn set_get_answer() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Link::new();
        contract.set_answer("question".to_string(),"answer".to_string());
        assert_eq!(
            "answer".to_string(),
            contract.get_answer("question".to_string())[0]
        );
        
    }

  }