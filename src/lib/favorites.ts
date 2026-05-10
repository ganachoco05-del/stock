import type { FavoriteStock } from "@/types/stock";

const FAVORITES_STORAGE_KEY = "stock-price-viewer:favorites";

export function readFavoriteStocks(fallback: FavoriteStock[]) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!savedFavorites) {
    return fallback;
  }

  try {
    const parsedFavorites = JSON.parse(savedFavorites) as FavoriteStock[];

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

export function saveFavoriteStocks(favorites: FavoriteStock[]) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}
