import type { StockQuote } from "@/types/stock";

type NaverRealtimeData = {
  cd?: string;
  nm?: string;
  nv?: number;
  hv?: number;
  lv?: number;
  cv?: number;
  cr?: number;
  nxtOverMarketPriceInfo?: {
    localTradedAt?: string;
  };
};

type NaverRealtimeResponse = {
  resultCode?: string;
  result?: {
    areas?: Array<{
      name?: string;
      datas?: NaverRealtimeData[];
    }>;
    time?: number;
  };
};

export class NaverFinanceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "NaverFinanceError";
  }
}

const NAVER_REALTIME_URL = "https://polling.finance.naver.com/api/realtime";

function normalizeKoreanSymbol(symbol: string) {
  return symbol.trim().toUpperCase().replace(/\.KS$/, "");
}

function getLatestTradingDay(data: NaverRealtimeData, fallbackTime?: number) {
  const tradedAt = data.nxtOverMarketPriceInfo?.localTradedAt;

  if (tradedAt) {
    return tradedAt.slice(0, 10);
  }

  if (fallbackTime) {
    return new Date(fallbackTime).toISOString().slice(0, 10);
  }

  return "-";
}

export async function fetchNaverFinanceQuote(
  symbol: string,
): Promise<StockQuote> {
  const normalizedSymbol = normalizeKoreanSymbol(symbol);
  const url = new URL(NAVER_REALTIME_URL);
  url.searchParams.set("query", `SERVICE_ITEM:${normalizedSymbol}`);

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new NaverFinanceError(
      "네이버 금융 서버 응답이 올바르지 않습니다.",
      502,
    );
  }

  const data = (await response.json()) as NaverRealtimeResponse;

  if (data.resultCode !== "success") {
    throw new NaverFinanceError("한국 종목 정보를 조회하지 못했습니다.", 400);
  }

  const quoteData = data.result?.areas
    ?.find((area) => area.name === "SERVICE_ITEM")
    ?.datas?.find((item) => item.cd === normalizedSymbol);

  if (
    !quoteData ||
    typeof quoteData.nv !== "number" ||
    typeof quoteData.hv !== "number" ||
    typeof quoteData.lv !== "number" ||
    typeof quoteData.cv !== "number" ||
    typeof quoteData.cr !== "number"
  ) {
    throw new NaverFinanceError(
      "네이버 금융에서 해당 한국 종목 가격을 찾지 못했습니다.",
      404,
    );
  }

  return {
    symbol: `${normalizedSymbol}.KS`,
    price: String(quoteData.nv),
    high: String(quoteData.hv),
    low: String(quoteData.lv),
    change: String(quoteData.cv),
    changePercent: `${quoteData.cr.toFixed(2)}%`,
    latestTradingDay: getLatestTradingDay(quoteData, data.result?.time),
  };
}
