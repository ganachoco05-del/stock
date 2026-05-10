import { NextRequest, NextResponse } from "next/server";
import {
  AlphaVantageError,
  parseAlphaVantageQuote,
} from "@/lib/alphaVantage";
import type { StockMarket } from "@/types/stock";

const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

function parseMarket(value: string | null): StockMarket {
  const normalizedValue = value?.trim().toUpperCase();

  if (normalizedValue === "KR") {
    return "KR";
  }

  return "US";
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const market = parseMarket(request.nextUrl.searchParams.get("market"));

  if (!symbol) {
    return NextResponse.json(
      { error: "조회할 종목 코드가 필요합니다." },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ALPHA_VANTAGE_API_KEY 환경변수가 없습니다. .env.local 파일에 API 키를 설정해주세요.",
      },
      { status: 500 },
    );
  }

  const url = new URL(ALPHA_VANTAGE_URL);
  url.searchParams.set("function", "GLOBAL_QUOTE");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Alpha Vantage 서버 응답이 올바르지 않습니다." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const quote = parseAlphaVantageQuote(data, { market });

    return NextResponse.json({ quote });
  } catch (error) {
    if (error instanceof AlphaVantageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "가격 정보를 조회하는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
