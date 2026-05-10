export type StockMarket = "US" | "KR";

export type StockCurrency = "USD" | "KRW";

export type StockSummary = {
  symbol: string;
  name: string;
  koreanName?: string;
  exchange: string;
  country: string;
  market: StockMarket;
  currency: StockCurrency;
  displaySymbol: string;
};

export type FavoriteStock = Pick<StockSummary, "symbol" | "name">;

export type StockQuote = {
  symbol: string;
  price: string;
  high: string;
  low: string;
  change: string;
  changePercent: string;
  latestTradingDay: string;
};
