# HashTimeLock Contract for Terra

## State

```
pub struct State {
    pub buyer: Addr,             - recipient for the locked asset
    pub seller: Addr,            - sender who lock the asset
    pub expiration: u64,         - when locked amount will be available for refund
    pub value: u64,              - amount to lock
    pub secret_hash: String,     - secret hash - like a password which is used for claiming
}
```

## Init HTLC

In this function we are initializing our HTLC. We are receiving as input arguments all of the props which are in the state
and we save them in the storage

```
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
```


## Claim

In our claim functionality we are receving secret as input argument, first we validate if the secret have correct length.
Then we are using hashing function in rust to generate secret_hash from the provided secret and we are checking if generated
secret_hash is mathicng the secret_hash which is saved in the storage in our initialize function. If everything is fine we are
sending the locked amount in the contract to the buyer. If any of the steps fails, we are throwing errors.


```
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

```


## Refund

In our refund functionality we are picking the data from the storage. Then we are comparing if the expiration is lower than the 
env.block.time.seconds and if it is we are sending the locked amount in the contract to the seller.

```
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

```
