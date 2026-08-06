/**
 * Formats a raw number into a human-readable string with K / M suffixes.
 * Examples:
 *   48200 -> "48.2K"
 *   1420 -> "1.4K"
 *   2500000 -> "2.5M"
 *   950 -> "950"
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  const val = Number(num);
  if (val >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (val >= 1_000) {
    return (val / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return val.toLocaleString();
}
