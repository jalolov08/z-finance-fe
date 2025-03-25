import { Currency } from "./currency.type";

export interface ICashbox {
  _id: string;
  name: string;
  balance: {
    $numberDecimal: string;
  };
  currency: Currency;
  ownerId: string;
  ownerName: string;
}
