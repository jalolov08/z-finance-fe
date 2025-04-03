export interface ICurrencyRates {
  _id: string;
  USD_to_RUB: {
    $numberDecimal: string;
  };
  USD_to_TJS: {
    $numberDecimal: string;
  };
  lastUpdate: string;
}
