export interface ICurrencyRates {
  _id: string;
  USD_to_RUB: {
    $numberDecimal: string;
  };
  USD_to_CNY: {
    $numberDecimal: string;
  };
  lastUpdate: string;
}
