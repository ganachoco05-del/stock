# Korean Stock Alpha Vantage Verification

Date: 2026-05-10

This document records the first verification pass for Korean stock quote support through the existing Alpha Vantage `GLOBAL_QUOTE` API route.

## Endpoint

```text
GET /api/quote?symbol={symbol}&market=KR
```

## Results

| Korean name | Symbol tested | Result | Notes |
| --- | --- | --- | --- |
| 삼성전자 | `005930.KS` | Not found | Alpha Vantage returned an empty quote through the app parser. |
| SK하이닉스 | `000660.KS` | Rate limited | Alpha Vantage free API limit was reached before a usable result. |
| NAVER | `035420.KS` | Rate limited | Alpha Vantage free API limit was reached before a usable result. |
| 카카오 | `035720.KS` | Rate limited | Alpha Vantage free API limit was reached before a usable result. |

## Conclusion

Alpha Vantage did not return a usable quote for Samsung Electronics with `005930.KS`, and subsequent Korean ticker checks quickly hit the free API rate limit.

For reliable Korean stock support, the app should keep the current market-aware quote API shape but add a Korean-stock-specific data provider.

Recommended next direction:

1. Keep Alpha Vantage for US stocks.
2. Add a separate provider path for Korean stocks.
3. Evaluate a free Korean-stock source such as a Yahoo Finance-compatible endpoint or another source suitable for study use.

## Follow-up

The app now uses a separate Korean-stock provider based on Naver Finance's realtime polling endpoint for `market=KR`.

Example:

```text
GET /api/quote?symbol=005930.KS&market=KR
```

Verified response shape:

```json
{
  "quote": {
    "symbol": "005930.KS",
    "price": "268500",
    "high": "270000",
    "low": "260000",
    "change": "3000",
    "changePercent": "1.10%",
    "latestTradingDay": "2026-05-08"
  }
}
```
