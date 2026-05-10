import type { FavoriteStock } from "@/types/stock";

const FAVORITES_STORAGE_KEY = "stock-price-viewer:favorites";
const FAVORITES_CHANGE_EVENT = "stock-price-viewer:favorites-change";

export function parseFavoriteStocksSnapshot(
  snapshot: string,
  fallback: FavoriteStock[],
) {
  try {
    const parsedFavorites = JSON.parse(snapshot) as FavoriteStock[];

    if (!Array.isArray(parsedFavorites)) {
      return fallback;
    }

    return parsedFavorites.filter(
      (favorite) =>
        typeof favorite.symbol === "string" && typeof favorite.name === "string",
    );
  } catch {
    return fallback;
  }
}

export function getFavoriteStocksSnapshot(fallback: FavoriteStock[]) {
  if (typeof window === "undefined") {
    return JSON.stringify(fallback);
  }

  return window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? JSON.stringify(fallback);
}

export function getFavoriteStocksServerSnapshot(fallback: FavoriteStock[]) {
  return JSON.stringify(fallback);
}

export function subscribeFavoriteStocks(onStoreChange: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  };
}

export function saveFavoriteStocks(favorites: FavoriteStock[]) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}
