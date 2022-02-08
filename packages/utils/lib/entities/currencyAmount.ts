import invariant from 'tiny-invariant';

import { Currency } from './currency';
import * as math from './../math';
import { BigNumber, BigNumberish } from '@liquality/types';

export class CurrencyAmount {
    public readonly currency: Currency;
    public readonly amount: BigNumber;

    protected constructor(currency: Currency, amount: BigNumberish) {
        this.currency = currency;
        this.amount = new BigNumber(amount.toString());
    }

    public add(other: CurrencyAmount): CurrencyAmount {
        invariant(this.currency.equals(other.currency), CurrencyAmount.errorMsg);
        const added = math.add(this.amount, other.amount);
        return new CurrencyAmount(this.currency, added);
    }

    public subtract(other: CurrencyAmount): CurrencyAmount {
        invariant(this.currency.equals(other.currency), CurrencyAmount.errorMsg);
        const subtracted = math.sub(this.amount, other.amount);
        return new CurrencyAmount(this.currency, subtracted);
    }

    public multiply(other: BigNumberish): CurrencyAmount {
        const multiplied = math.mul(this.amount, other);
        return new CurrencyAmount(this.currency, multiplied);
    }

    public equals(other: CurrencyAmount): boolean {
        invariant(this.currency.equals(other.currency), CurrencyAmount.errorMsg);
        const equals = math.eq(this.amount, other.amount);
        return equals;
    }

    public lte(other: CurrencyAmount): boolean {
        invariant(this.currency.equals(other.currency), CurrencyAmount.errorMsg);
        const lte = math.lte(this.amount, other.amount);
        return lte;
    }

    public gte(other: CurrencyAmount): boolean {
        invariant(this.currency.equals(other.currency), CurrencyAmount.errorMsg);
        const gte = math.gte(this.amount, other.amount);
        return gte;
    }

    static errorMsg = `Currencies do not match`;
}
