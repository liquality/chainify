use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Invalid secret length")]
    InvalidSecret {},
    #[error("Swap is not expired")]
    SwapNotExpired {},
    #[error("Balance is 0")]
    NoBalance {},
    #[error("Query not implemented")]
    QueryNotImplemented {},
    #[error("Invalid amount of coins")]
    InvalidAmountOfCoins {},
    // Add any other custom errors you like here.
    // Look at https://docs.rs/thiserror/1.0.21/thiserror/ for details.
}