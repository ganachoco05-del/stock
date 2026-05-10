"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getFavoriteStocksServerSnapshot,
  getFavoriteStocksSnapshot,
  parseFavoriteStocksSnapshot,
  saveFavoriteStocks,
  subscribeFavoriteStocks,
} from "@/lib/favorites";
import { defaultFavoriteStocks, stockList } from "@/lib/stocks";
import type {
  FavoriteStock,
  StockMarket,
  StockQuote,
  StockSummary,
} from "@/types/stock";

type QuoteApiResponse = {
  quote?: StockQuote;
  error?: string;
};

type QuoteMetricProps = {
  label: string;
  value: string;
  tone?: "default" | "up" | "down";
  loading: boolean;
};

const marketLabels: Record<StockMarket, string> = {
  US: "미국",
  KR: "한국",
};

const subscribeHydrationState = () => () => {};

const getClientHydrationState = () => true;

const getServerHydrationState = () => false;

const formatCurrency = (value?: string) => {
  if (!value) {
    return "-";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return value;
  }

  return `$${numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatChange = (quote: StockQuote | null) => {
  if (!quote) {
    return "-";
  }

  const changeValue = Number(quote.change);
  const formattedChange = Number.isNaN(changeValue)
    ? quote.change
    : `$${changeValue.toFixed(2)}`;

  return `${formattedChange} (${quote.changePercent})`;
};

const getChangeTone = (quote: StockQuote | null): "up" | "down" | "default" => {
  if (!quote) {
    return "default";
  }

  const changeValue = Number(quote.change);

  if (Number.isNaN(changeValue) || changeValue === 0) {
    return "default";
  }

  return changeValue > 0 ? "up" : "down";
};

function getStockDisplayName(stock: StockSummary) {
  return stock.koreanName ?? stock.name;
}

function QuoteMetric({
  label,
  value,
  tone = "default",
  loading,
}: QuoteMetricProps) {
  const valueColor = {
    default: "text-slate-950",
    up: "text-emerald-700",
    down: "text-rose-700",
  }[tone];

  return (
    <div className="min-h-28 rounded-md border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-28 animate-pulse rounded bg-slate-200" />
      ) : (
        <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
      )}
    </div>
  );
}

export default function Home() {
  const didLoadInitialQuote = useRef(false);
  const quoteAbortController = useRef<AbortController | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<StockMarket>("US");
  const [symbolInput, setSymbolInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockSummary>(stockList[0]);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [symbolError, setSymbolError] = useState("");
  const isHydrated = useSyncExternalStore(
    subscribeHydrationState,
    getClientHydrationState,
    getServerHydrationState,
  );
  const favoriteSnapshot = useSyncExternalStore(
    subscribeFavoriteStocks,
    () => getFavoriteStocksSnapshot(defaultFavoriteStocks),
    () => getFavoriteStocksServerSnapshot(defaultFavoriteStocks),
  );
  const favorites = useMemo(
    () =>
      isHydrated
        ? parseFavoriteStocksSnapshot(favoriteSnapshot, defaultFavoriteStocks)
        : defaultFavoriteStocks,
    [favoriteSnapshot, isHydrated],
  );

  const marketStocks = useMemo(
    () => stockList.filter((stock) => stock.market === selectedMarket),
    [selectedMarket],
  );

  const filteredStocks = useMemo(() => {
    const keyword = nameInput.trim().toLowerCase();

    if (!keyword) {
      return marketStocks.slice(0, 5);
    }

    return marketStocks
      .filter((stock) => {
        const displaySymbol = stock.displaySymbol.toLowerCase();
        const symbol = stock.symbol.toLowerCase();
        const name = stock.name.toLowerCase();
        const koreanName = stock.koreanName?.toLowerCase() ?? "";
        const aliases = stock.searchAliases?.map((alias) =>
          alias.toLowerCase(),
        ) ?? [];

        return (
          displaySymbol.includes(keyword) ||
          symbol.includes(keyword) ||
          name.includes(keyword) ||
          koreanName.includes(keyword) ||
          aliases.some((alias) => alias.includes(keyword))
        );
      })
      .slice(0, 8);
  }, [marketStocks, nameInput]);

  const selectedIsFavorite = favorites.some(
    (favorite) => favorite.symbol === selectedStock.symbol,
  );

  const loadQuote = useCallback(async (symbol: string, market: StockMarket) => {
    quoteAbortController.current?.abort();

    const controller = new AbortController();
    quoteAbortController.current = controller;

    setQuoteLoading(true);
    setQuoteError("");

    try {
      const searchParams = new URLSearchParams({ symbol, market });
      const response = await fetch(`/api/quote?${searchParams.toString()}`, {
        signal: controller.signal,
      });
      const data = (await response.json()) as QuoteApiResponse;

      if (!response.ok || !data.quote) {
        throw new Error(data.error ?? "가격 정보를 조회하지 못했습니다.");
      }

      setQuote(data.quote);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setQuote(null);
      setQuoteError(
        error instanceof Error
          ? error.message
          : "가격 정보를 조회하는 중 오류가 발생했습니다.",
      );
    } finally {
      if (quoteAbortController.current === controller) {
        setQuoteLoading(false);
        quoteAbortController.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (didLoadInitialQuote.current) {
      return;
    }

    didLoadInitialQuote.current = true;
    void loadQuote(stockList[0].symbol, stockList[0].market);
  }, [loadQuote]);

  useEffect(() => {
    return () => quoteAbortController.current?.abort();
  }, []);

  const selectStock = (stock: StockSummary) => {
    setSelectedStock(stock);
    setSelectedMarket(stock.market);
    setSymbolInput(stock.displaySymbol);
    setNameInput(getStockDisplayName(stock));
    setSymbolError("");
    void loadQuote(stock.symbol, stock.market);
  };

  const handleMarketChange = (market: StockMarket) => {
    if (market === selectedMarket) {
      return;
    }

    const nextStock = stockList.find((stock) => stock.market === market);

    if (!nextStock) {
      return;
    }

    setSelectedMarket(market);
    setSymbolInput("");
    setNameInput("");
    setSymbolError("");
    setSelectedStock(nextStock);
    void loadQuote(nextStock.symbol, nextStock.market);
  };

  const handleSymbolSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSymbol = symbolInput.trim().toUpperCase();

    if (!normalizedSymbol) {
      setSymbolError("조회할 종목 코드를 입력해주세요.");
      return;
    }

    const foundStock = marketStocks.find(
      (stock) =>
        stock.symbol.toUpperCase() === normalizedSymbol ||
        stock.displaySymbol.toUpperCase() === normalizedSymbol,
    );

    if (!foundStock) {
      setSymbolError(
        `${marketLabels[selectedMarket]} 대표 종목 목록에서 찾을 수 없습니다.`,
      );
      return;
    }

    selectStock(foundStock);
  };

  const updateFavorites = (nextFavorites: FavoriteStock[]) => {
    saveFavoriteStocks(nextFavorites);
  };

  const toggleSelectedFavorite = () => {
    if (selectedIsFavorite) {
      updateFavorites(
        favorites.filter((favorite) => favorite.symbol !== selectedStock.symbol),
      );
      return;
    }

    updateFavorites([
      ...favorites,
      {
        symbol: selectedStock.symbol,
        name: getStockDisplayName(selectedStock),
      },
    ]);
  };

  const removeFavorite = (symbol: string) => {
    updateFavorites(favorites.filter((favorite) => favorite.symbol !== symbol));
  };

  const changeTone = getChangeTone(quote);
  const symbolPlaceholder =
    selectedMarket === "US" ? "예: AAPL, MSFT, TSLA" : "예: 005930, 000660";
  const namePlaceholder =
    selectedMarket === "US"
      ? "예: Apple, Microsoft, Tesla"
      : "예: 삼성전자, SK하이닉스, NAVER";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
            Free Stock Price Viewer
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                주식 가격 조회
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                미국/한국 시장을 선택하고 종목 코드나 종목 이름으로 검색할 수
                있는 공부용 웹앱입니다.
              </p>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              미국/한국 시장 선택 구현 완료
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-800">시장 선택</p>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1">
                  {(["US", "KR"] as StockMarket[]).map((market) => (
                    <button
                      key={market}
                      type="button"
                      onClick={() => handleMarketChange(market)}
                      disabled={quoteLoading}
                      className={`min-h-11 rounded-md px-4 text-sm font-semibold transition ${
                        selectedMarket === market
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:bg-white/70"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {marketLabels[market]}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSymbolSearch}>
                <label
                  htmlFor="symbol-search"
                  className="text-sm font-semibold text-slate-800"
                >
                  종목 코드 입력
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="symbol-search"
                    type="text"
                    value={symbolInput}
                    onChange={(event) => {
                      setSymbolInput(event.target.value.toUpperCase());
                      setSymbolError("");
                    }}
                    placeholder={symbolPlaceholder}
                    className="min-h-12 flex-1 rounded-md border border-slate-300 bg-white px-4 text-base uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className="min-h-12 rounded-md bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {quoteLoading ? "조회 중" : "조회"}
                  </button>
                </div>
                {symbolError ? (
                  <p className="mt-2 text-sm font-medium text-rose-700">
                    {symbolError}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    {marketLabels[selectedMarket]} 대표 종목 목록 안에서 먼저
                    검색합니다.
                  </p>
                )}
              </form>

              <div>
                <label
                  htmlFor="name-search"
                  className="text-sm font-semibold text-slate-800"
                >
                  종목 이름 입력
                </label>
                <input
                  id="name-search"
                  type="text"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  placeholder={namePlaceholder}
                  className="mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        type="button"
                        onClick={() => selectStock(stock)}
                        disabled={quoteLoading}
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {getStockDisplayName(stock)}
                          </span>
                          <span className="text-sm text-slate-500">
                            {stock.exchange} · {stock.country}
                          </span>
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                          {stock.displaySymbol}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-5 text-sm text-slate-500">
                      검색 결과가 없습니다. {namePlaceholder}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">즐겨찾기</h2>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
                {favorites.length}
              </span>
            </div>
            {favorites.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                {favorites.map((favorite) => {
                  const stock = stockList.find(
                    (item) => item.symbol === favorite.symbol,
                  );

                  return (
                    <div
                      key={favorite.symbol}
                      className="flex min-h-14 items-center gap-2 rounded-md border border-slate-200 px-3 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (stock) {
                            selectStock(stock);
                          }
                        }}
                        disabled={quoteLoading || !stock}
                        className="flex flex-1 items-center justify-between gap-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {stock?.displaySymbol ?? favorite.symbol}
                          </span>
                          <span className="text-sm text-slate-500">
                            {favorite.name}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-blue-700">
                          조회
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFavorite(favorite.symbol)}
                        className="min-h-9 rounded-md px-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-rose-700"
                        aria-label={`${favorite.symbol} 즐겨찾기 삭제`}
                      >
                        삭제
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                저장된 즐겨찾기가 없습니다.
              </div>
            )}
          </aside>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">선택 종목</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {getStockDisplayName(selectedStock)}{" "}
                <span className="text-slate-400">
                  / {selectedStock.displaySymbol}
                </span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {selectedStock.exchange} · {selectedStock.country} ·{" "}
                {marketLabels[selectedStock.market]}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleSelectedFavorite}
              disabled={quoteLoading}
              className="min-h-11 rounded-md border border-blue-300 px-4 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              {selectedIsFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            </button>
          </div>

          {quoteError ? (
            <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {quoteError}
            </div>
          ) : null}

          {quoteLoading ? (
            <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
              {selectedStock.displaySymbol} 가격 정보를 조회하고 있습니다.
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuoteMetric
              label="현재가"
              value={formatCurrency(quote?.price)}
              loading={quoteLoading}
            />
            <QuoteMetric
              label="오늘 최고가"
              value={formatCurrency(quote?.high)}
              tone="up"
              loading={quoteLoading}
            />
            <QuoteMetric
              label="오늘 최저가"
              value={formatCurrency(quote?.low)}
              tone="down"
              loading={quoteLoading}
            />
            <QuoteMetric
              label="전일 대비"
              value={formatChange(quote)}
              tone={changeTone}
              loading={quoteLoading}
            />
          </div>

          <div className="mt-5 rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-600">
            마지막 거래일: {quoteLoading ? "조회 중" : quote?.latestTradingDay ?? "-"}
          </div>
        </section>
      </div>
    </main>
  );
}
