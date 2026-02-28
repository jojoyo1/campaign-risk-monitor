/**
 * Number formatting utilities for the Campaign Risk Monitor dashboard.
 */

/**
 * Format a number as USD currency with commas.
 * Examples: 1234.56 -> "$1,234.56", 1000000 -> "$1,000,000.00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as currency with cents.
 */
export function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a percentage with 1 decimal place.
 * Input should be a decimal (0.5 = 50%).
 */
export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format a percentage from a value already expressed as a percent.
 * Input is already in percent form (50 = 50%).
 */
export function formatPctRaw(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Abbreviate large numbers: 1234 -> "1.2K", 1234567 -> "1.2M"
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-US");
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Format a date string (ISO) as a short readable date.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date string as short (e.g., "Jan 15")
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a delta/change value with a sign and color indicator.
 * Returns { text, isPositive, isNegative }
 */
export function formatDelta(value: number): {
  text: string;
  isPositive: boolean;
  isNegative: boolean;
} {
  const pct = (value * 100).toFixed(1);
  if (value > 0) {
    return { text: `+${pct}%`, isPositive: true, isNegative: false };
  }
  if (value < 0) {
    return { text: `${pct}%`, isPositive: false, isNegative: true };
  }
  return { text: "0.0%", isPositive: false, isNegative: false };
}

/**
 * Format a pacing index value.
 * 1.0 = on pace, <1 = behind, >1 = ahead
 */
export function formatPacingIndex(value: number): string {
  return value.toFixed(2);
}

/**
 * Format ROAS value.
 */
export function formatRoas(value: number): string {
  return `${value.toFixed(2)}x`;
}
