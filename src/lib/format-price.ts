export function formatPriceToman(amount: number): string {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions.toLocaleString("fa-IR")} میلیون`;
  }
  return formatPriceToman(amount);
}
