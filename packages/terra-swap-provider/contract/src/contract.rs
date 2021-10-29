use cosmwasm_bignumber::{Decimal256, Uint256};
use cosmwasm_std::entry_point;
#[cfg(not(feature = "library"))]
use cosmwasm_std::{
    BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
};
use hex::decode;
use sha2::{Digest, Sha256};
use terra_cosmwasm::TerraQuerier;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    if info.funds.len() != 1 {
        return Err(ContractError::InvalidAmountOfCoins {});
    }

    let state = State {
        buyer: msg.buyer.clone(),
        seller: msg.seller.clone(),
        expiration: msg.expiration,
        value: msg.value,
        secret_hash: msg.secret_hash,
        coin: info.funds[0].clone(),
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

    let sum_balance: u128 = balances.iter().map(|coin| coin.amount.u128()).sum();

    if sum_balance == 0 {
        return Err(ContractError::NoBalance {});
    }

    let coin = state.coin;

    let after_tax;
    if coin.denom == "uusd" {
        after_tax = deduct_tax(
            deps.as_ref(),
            Coin::new(Uint128::from(coin.amount).u128(), coin.denom),
        )
        .unwrap();
    } else {
        after_tax = coin;
    }

    let send = BankMsg::Send {
        to_address: state.buyer.into_string(),
        amount: vec![after_tax],
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

    let coin = state.coin;

    let after_tax;
    if coin.denom == "uusd" {
        after_tax = deduct_tax(
            deps.as_ref(),
            Coin::new(Uint128::from(coin.amount).u128(), coin.denom),
        )
        .unwrap();
    } else {
        after_tax = coin;
    }

    let send = BankMsg::Send {
        to_address: state.seller.into_string(),
        amount: vec![after_tax],
    };

    Ok(Response::new().add_message(send))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_: Deps, _env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
    match msg {
        _ => return Err(ContractError::QueryNotImplemented {}),
    }
}

pub fn query_tax_rate_and_cap(deps: Deps, denom: String) -> StdResult<(Decimal256, Uint256)> {
    let terra_querier = TerraQuerier::new(&deps.querier);
    let rate = terra_querier.query_tax_rate()?.rate;
    let cap = terra_querier.query_tax_cap(denom)?.cap;
    Ok((rate.into(), cap.into()))
}

pub fn query_tax_rate(deps: Deps) -> StdResult<Decimal256> {
    let terra_querier = TerraQuerier::new(&deps.querier);
    Ok(terra_querier.query_tax_rate()?.rate.into())
}

pub fn compute_tax(deps: Deps, coin: &Coin) -> StdResult<Uint256> {
    let terra_querier = TerraQuerier::new(&deps.querier);
    let tax_rate = Decimal256::from((terra_querier.query_tax_rate()?).rate);
    let tax_cap = Uint256::from((terra_querier.query_tax_cap(coin.denom.to_string())?).cap);
    let amount = Uint256::from(coin.amount);
    Ok(std::cmp::min(
        amount * Decimal256::one() - amount / (Decimal256::one() + tax_rate),
        tax_cap,
    ))
}

pub fn deduct_tax(deps: Deps, coin: Coin) -> StdResult<Coin> {
    let tax_amount = compute_tax(deps, &coin)?;
    Ok(Coin {
        denom: coin.denom,
        amount: (Uint256::from(coin.amount) - tax_amount).into(),
    })
}
