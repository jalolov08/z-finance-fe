import { Currency } from "./currency.type";

export enum TransactionType {
  INCOME = "Приход",
  EXPENSE = "Расход",
}

export interface ITransaction {
  _id: string;
  type: TransactionType;
  date: string;
  cashboxId: string;
  cashboxName: string;
  currency: Currency;
  USD_to_RUB: {
    $numberDecimal: string;
  };
  USD_to_TJS: {
    $numberDecimal: string;
  };
  amount: {
    USD: {
      $numberDecimal: string;
    };
    RUB: {
      $numberDecimal: string;
    };
    TJS: {
      $numberDecimal: string;
    };
  };
  expenseId?: string;
  expenseName?: string;
  incomeId?: string;
  incomeName?: string;
  balanceBefore: {
    $numberDecimal: string;
  };
  balanceAfter: {
    $numberDecimal: string;
  };
  description: string;
  ownerId: {
    $numberDecimal: string;
  };
  ownerName: string;
}
