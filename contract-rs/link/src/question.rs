use crate::*;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Question {
    pub question_hash: String,
    pub is_answered: bool,
}

impl Question{
  pub fn new() -> Self{
    Self {
      question_hash: "question".to_string(),
      is_answered: false,
    }
  }
}