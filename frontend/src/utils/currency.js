// src/utils/currency.js
export const CURRENCIES = [
  { code: "KES", label: "Kenyan Shilling",    symbol: "KSh", flag: "🇰🇪" },
  { code: "UGX", label: "Ugandan Shilling",   symbol: "USh", flag: "🇺🇬" },
  { code: "TZS", label: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  { code: "RWF", label: "Rwandan Franc",      symbol: "RWF", flag: "🇷🇼" },
  { code: "BIF", label: "Burundian Franc",    symbol: "BIF", flag: "🇧🇮" },
  { code: "USD", label: "US Dollar",          symbol: "$",   flag: "🇺🇸" },
];

// ✅ NEW: Map country name → currency code
export const COUNTRY_CURRENCY_MAP = {
  Kenya:    "KES",
  Uganda:   "UGX",
  Tanzania: "TZS",
  Rwanda:   "RWF",
  Burundi:  "BIF",
  // fallback for anything else
};

export function getCurrencyByCountry(country = "") {
  return COUNTRY_CURRENCY_MAP[country] || "USD";
}

const RATES_FROM_KES = {
  KES: 1,
  UGX: 28.5,
  TZS: 23.2,
  RWF: 10.8,
  BIF: 110.0,
  USD: 0.0077,
};

export function convertPrice(amount, fromCode = "KES", toCode = "KES") {
  if (!amount || fromCode === toCode) return Number(amount);
  const inKES = Number(amount) / (RATES_FROM_KES[fromCode] || 1);
  return inKES * (RATES_FROM_KES[toCode] || 1);
}

export function formatPrice(amount, currencyCode = "KES", fromCode = "KES") {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const converted = convertPrice(amount, fromCode, currencyCode);
  const formatted = converted >= 1000
    ? converted.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : converted.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${currency.symbol} ${formatted}`;
}

export const DEFAULT_CURRENCY = "USD";
export const STORAGE_KEY = "hostein_currency";

export function getSavedCurrency() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_CURRENCY; }
  catch { return DEFAULT_CURRENCY; }
}

export function saveCurrency(code) {
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
}