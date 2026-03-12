// currency.js — shared across ServicesPage, ServiceDetailsPage, MyServicesPage
export const CURRENCIES = [
  { code: "KES", label: "Kenyan Shilling",    symbol: "KSh",  flag: "🇰🇪" },
  { code: "UGX", label: "Ugandan Shilling",   symbol: "USh",  flag: "🇺🇬" },
  { code: "TZS", label: "Tanzanian Shilling", symbol: "TSh",  flag: "🇹🇿" },
  { code: "RWF", label: "Rwandan Franc",      symbol: "RWF",  flag: "🇷🇼" },
  { code: "BIF", label: "Burundian Franc",    symbol: "BIF",  flag: "🇧🇮" },
  { code: "USD", label: "US Dollar",          symbol: "$",    flag: "🇺🇸" },
];

// Approximate rates relative to KES (base = 1 KES)
// Update these periodically or swap for a live API
const RATES_FROM_KES = {
  KES: 1,
  UGX: 28.5,
  TZS: 23.2,
  RWF: 10.8,
  BIF: 110.0,
  USD: 0.0077,
};

/**
 * Convert a price stored in KES to the target currency.
 * If your DB stores prices in a different base currency,
 * adjust the `fromCode` parameter accordingly.
 */
export function convertPrice(amount, fromCode = "KES", toCode = "KES") {
  if (!amount || fromCode === toCode) return Number(amount);
  const inKES = Number(amount) / (RATES_FROM_KES[fromCode] || 1);
  return inKES * (RATES_FROM_KES[toCode] || 1);
}

export function formatPrice(amount, currencyCode = "KES", fromCode = "KES") {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const converted = convertPrice(amount, fromCode, currencyCode);

  // Format number nicely
  const formatted = converted >= 1000
    ? converted.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : converted.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return `${currency.symbol} ${formatted}`;
}

export const DEFAULT_CURRENCY = "KES";
export const STORAGE_KEY = "hostein_currency";

export function getSavedCurrency() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_CURRENCY; }
  catch { return DEFAULT_CURRENCY; }
}

export function saveCurrency(code) {
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
}