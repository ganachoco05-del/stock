export type StockSummary = {
  symbol: string;
  name: string;
  exchange: string;
  country: string;
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
