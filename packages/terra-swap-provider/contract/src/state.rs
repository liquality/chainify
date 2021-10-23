use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub buyer: Addr,
    pub seller: Addr,
    pub expiration: u64,
    pub value: u64,
    pub secret_hash: String,
}

pub const STATE: Item<State> = Item::new("state");