import type { FavoriteStock, StockSummary } from "@/types/stock";

export const stockList: StockSummary[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", country: "US" },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    country: "US",
  },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", country: "US" },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc. Class A",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "IBM",
    name: "International Business Machines Corporation",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "CRM",
    name: "Salesforce Inc.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "PYPL",
    name: "PayPal Holdings Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "DIS",
    name: "The Walt Disney Company",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "NKE",
    name: "Nike Inc.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "KO",
    name: "The Coca-Cola Company",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "PEP",
    name: "PepsiCo Inc.",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "COST",
    name: "Costco Wholesale Corporation",
    exchange: "NASDAQ",
    country: "US",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "BAC",
    name: "Bank of America Corporation",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "MA",
    name: "Mastercard Incorporated",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "LLY",
    name: "Eli Lilly and Company",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    exchange: "NYSE",
    country: "US",
  },
  {
    symbol: "BA",
    name: "The Boeing Company",
    exchange: "NYSE",
    country: "US",
  },
];

export const defaultFavoriteStocks: FavoriteStock[] = stockList
  .filter((stock) => ["AAPL", "MSFT", "TSLA"].includes(stock.symbol))
  .map(({ symbol, name }) => ({ symbol, name }));

export const initialSearchResults = stockList.slice(0, 3);
