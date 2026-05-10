import type { StockMarket, StockQuote } from "@/types/stock";

type AlphaVantageGlobalQuote = {
  "01. symbol"?: string;
  "03. high"?: string;
  "04. low"?: string;
  "05. price"?: string;
  "07. latest trading day"?: string;
  "09. change"?: string;
  "10. change percent"?: string;
};

type AlphaVantageQuoteResponse = {
  "Global Quote"?: AlphaVantageGlobalQuote;
  Note?: string;
  Information?: string;
  Error?: string;
  "Error Message"?: string;
};

type ParseAlphaVantageQuoteOptions = {
  market: StockMarket;
};

export class AlphaVantageError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "AlphaVantageError";
  }
}

export function parseAlphaVantageQuote(
  data: AlphaVantageQuoteResponse,
  options: ParseAlphaVantageQuoteOptions,
): StockQuote {
  if (data.Note || data.Information) {
    throw new AlphaVantageError(
      "Alpha Vantage API 호출 제한에 도달했거나 일시적으로 조회할 수 없습니다.",
      429,
    );
  }

  if (data.Error || data["Error Message"]) {
    throw new AlphaVantageError("종목 정보를 조회하지 못했습니다.", 400);
  }

  const quote = data["Global Quote"];

  if (!quote || Object.keys(quote).length === 0) {
    const message =
      options.market === "KR"
        ? "Alpha Vantage에서 해당 한국 종목 가격을 찾지 못했습니다. 한국 주식용 데이터 소스를 별도로 연결해야 할 수 있습니다."
        : "조회 결과가 없습니다. 종목 코드를 다시 확인해주세요.";

    throw new AlphaVantageError(message, 404);
  }

  const symbol = quote["01. symbol"];
  const price = quote["05. price"];
  const high = quote["03. high"];
  const low = quote["04. low"];
  const latestTradingDay = quote["07. latest trading day"];
  const change = quote["09. change"];
  const changePercent = quote["10. change percent"];

  if (
    !symbol ||
    !price ||
    !high ||
    !low ||
    !latestTradingDay ||
    !change ||
    !changePercent
  ) {
    throw new AlphaVantageError(
      "Alpha Vantage 응답 형식이 예상과 다릅니다.",
      502,
    );
  }

  return {
    symbol,
    price,
    high,
    low,
    change,
    changePercent,
    latestTradingDay,
  };
}
