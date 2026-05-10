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

const createKrStock = (
  displaySymbol: string,
  koreanName: string,
  name: string,
  searchAliases: string[] = [],
): StockSummary => ({
  symbol: `${displaySymbol}.KS`,
  name,
  koreanName,
  exchange: "KRX",
  country: "KR",
  market: "KR",
  currency: "KRW",
  displaySymbol,
  searchAliases,
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
  createKrStock("005930", "삼성전자", "Samsung Electronics Co., Ltd.", [
    "삼전",
    "samsung",
    "samsung electronics",
    "005930.ks",
  ]),
  createKrStock("000660", "SK하이닉스", "SK hynix Inc.", [
    "하이닉스",
    "hynix",
    "sk hynix",
    "000660.ks",
  ]),
  createKrStock("035420", "NAVER", "NAVER Corporation", [
    "네이버",
    "naver",
    "035420.ks",
  ]),
  createKrStock("035720", "카카오", "Kakao Corp.", [
    "kakao",
    "035720.ks",
  ]),
  createKrStock("005380", "현대차", "Hyundai Motor Company", [
    "현대자동차",
    "hyundai",
    "hyundai motor",
    "005380.ks",
  ]),
  createKrStock("000270", "기아", "Kia Corporation", [
    "kia",
    "000270.ks",
  ]),
  createKrStock("051910", "LG화학", "LG Chem, Ltd.", [
    "lg chem",
    "051910.ks",
  ]),
  createKrStock("006400", "삼성SDI", "Samsung SDI Co., Ltd.", [
    "samsung sdi",
    "006400.ks",
  ]),
  createKrStock("068270", "셀트리온", "Celltrion, Inc.", [
    "celltrion",
    "068270.ks",
  ]),
  createKrStock("105560", "KB금융", "KB Financial Group Inc.", [
    "kb",
    "kb금융지주",
    "kb financial",
    "105560.ks",
  ]),
  createKrStock("055550", "신한지주", "Shinhan Financial Group Co., Ltd.", [
    "신한",
    "shinhan",
    "055550.ks",
  ]),
  createKrStock("012330", "현대모비스", "Hyundai Mobis Co., Ltd.", [
    "모비스",
    "hyundai mobis",
    "012330.ks",
  ]),
  createKrStock("028260", "삼성물산", "Samsung C&T Corporation", [
    "samsung c&t",
    "028260.ks",
  ]),
  createKrStock("086790", "하나금융지주", "Hana Financial Group Inc.", [
    "하나금융",
    "hana",
    "hana financial",
    "086790.ks",
  ]),
  createKrStock("096770", "SK이노베이션", "SK Innovation Co., Ltd.", [
    "sk innovation",
    "096770.ks",
  ]),
];

export const defaultFavoriteStocks: FavoriteStock[] = stockList
  .filter((stock) => ["AAPL", "MSFT", "TSLA"].includes(stock.symbol))
  .map(({ symbol, name }) => ({ symbol, name }));

export const initialSearchResults = stockList.slice(0, 3);
