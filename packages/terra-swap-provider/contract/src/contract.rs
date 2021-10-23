use cosmwasm_std::entry_point;
#[cfg(not(feature = "library"))]
use cosmwasm_std::Coin;
use cosmwasm_std::{BankMsg, Binary, Deps, DepsMut, Env, MessageInfo, Response};
use hex::decode;
use sha2::{Digest, Sha256};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        buyer: msg.buyer.clone(),
        seller: msg.seller.clone(),
        expiration: msg.expiration,
        value: msg.value,
        secret_hash: msg.secret_hash,
    };

    STATE.save(deps.storage, &state)?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Claim { secret } => try_claim(deps, env, secret),
        ExecuteMsg::Refund {} => try_refund(deps, env),
    }
}

fn try_claim(deps: DepsMut, env: Env, secret: String) -> Result<Response, ContractError> {
    if secret.len() != 64 {
        return Err(ContractError::InvalidSecret {});
    }

    let state = STATE.load(deps.storage)?;

    let mut hasher = Sha256::default();
    let message: Vec<u8> = decode(secret).expect("Invalid Hex String");

    hasher.update(&message);

    let secret_hash: String = format!("{:x}", hasher.finalize());

    if state.secret_hash != secret_hash {
        return Err(ContractError::InvalidSecret {});
    }

    let balances: Vec<Coin> = deps.querier.query_all_balances(&env.contract.address)?;

    let sum_balance: u128 = balances.iter().map(|b| b.amount.u128()).sum();

    if sum_balance == 0 {
        return Err(ContractError::NoBalance {});
    }

    let send = BankMsg::Send {
        to_address: state.buyer.into_string(),
        amount: balances,
    };

    Ok(Response::new().add_message(send))
}

fn try_refund(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let state = STATE.load(deps.storage)?;

    if env.block.time.seconds() < state.expiration {
        return Err(ContractError::SwapNotExpired {});
    }

    let balances: Vec<Coin> = deps.querier.query_all_balances(&env.contract.address)?;

    let sum_balance: u128 = balances.iter().map(|b| b.amount.u128()).sum();

    if sum_balance == 0 {
        return Err(ContractError::NoBalance {});
    }

    let send = BankMsg::Send {
        to_address: state.seller.into_string(),
        amount: balances,
    };

    Ok(Response::new().add_message(send))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_: Deps, _env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
    match msg {
        _ => return Err(ContractError::QueryNotImplemented {}),
    }
}