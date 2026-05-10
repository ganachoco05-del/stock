import type { FavoriteStock, StockSummary } from "@/types/stock";

const createUsStock = (
  symbol: string,
  name: string,
  exchange: string,
): StockSummary => ({
  symbol,
  name,
  exchange,
  country: "US",
  market: "US",
  currency: "USD",
  displaySymbol: symbol,
});

export const stockList: StockSummary[] = [
  createUsStock("AAPL", "Apple Inc.", "NASDAQ"),
  createUsStock("MSFT", "Microsoft Corporation", "NASDAQ"),
  createUsStock("TSLA", "Tesla Inc.", "NASDAQ"),
  createUsStock("NVDA", "NVIDIA Corporation", "NASDAQ"),
  createUsStock("AMZN", "Amazon.com Inc.", "NASDAQ"),
  createUsStock("GOOGL", "Alphabet Inc. Class A", "NASDAQ"),
  createUsStock("META", "Meta Platforms Inc.", "NASDAQ"),
  createUsStock("NFLX", "Netflix Inc.", "NASDAQ"),
  createUsStock("AMD", "Advanced Micro Devices Inc.", "NASDAQ"),
  createUsStock("INTC", "Intel Corporation", "NASDAQ"),
  createUsStock("IBM", "International Business Machines Corporation", "NYSE"),
  createUsStock("ORCL", "Oracle Corporation", "NYSE"),
  createUsStock("CRM", "Salesforce Inc.", "NYSE"),
  createUsStock("PYPL", "PayPal Holdings Inc.", "NASDAQ"),
  createUsStock("DIS", "The Walt Disney Company", "NYSE"),
  createUsStock("NKE", "Nike Inc.", "NYSE"),
  createUsStock("KO", "The Coca-Cola Company", "NYSE"),
  createUsStock("PEP", "PepsiCo Inc.", "NASDAQ"),
  createUsStock("WMT", "Walmart Inc.", "NYSE"),
  createUsStock("COST", "Costco Wholesale Corporation", "NASDAQ"),
  createUsStock("JPM", "JPMorgan Chase & Co.", "NYSE"),
  createUsStock("BAC", "Bank of America Corporation", "NYSE"),
  createUsStock("V", "Visa Inc.", "NYSE"),
  createUsStock("MA", "Mastercard Incorporated", "NYSE"),
  createUsStock("JNJ", "Johnson & Johnson", "NYSE"),
  createUsStock("PFE", "Pfizer Inc.", "NYSE"),
  createUsStock("LLY", "Eli Lilly and Company", "NYSE"),
  createUsStock("XOM", "Exxon Mobil Corporation", "NYSE"),
  createUsStock("CVX", "Chevron Corporation", "NYSE"),
  createUsStock("BA", "The Boeing Company", "NYSE"),
];

export const defaultFavoriteStocks: FavoriteStock[] = stockList
  .filter((stock) => ["AAPL", "MSFT", "TSLA"].includes(stock.symbol))
  .map(({ symbol, name }) => ({ symbol, name }));

export const initialSearchResults = stockList.slice(0, 3);
