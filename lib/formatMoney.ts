const eurAmountSk = new Intl.NumberFormat('sk-SK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const eurCurrencySk = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Numeric part only, e.g. `1 234,56` (Slovak grouping and decimal comma). */
export function formatEurAmount(amount: number): string {
  return eurAmountSk.format(amount);
}

/** Full amount with the euro symbol, e.g. `200,00 €` or `-50,00 €`. */
export function formatEurCurrency(amount: number): string {
  return eurCurrencySk.format(amount);
}
