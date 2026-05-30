export function getShippingFlatRate(): number {
  const raw = process.env.SHIPPING_FLAT_RATE;
  const parsed = raw ? Number.parseInt(raw, 10) : 50_000;
  return Number.isFinite(parsed) ? parsed : 50_000;
}

export function getFreeShippingThreshold(): number {
  const raw = process.env.FREE_SHIPPING_THRESHOLD;
  const parsed = raw ? Number.parseInt(raw, 10) : 2_000_000;
  return Number.isFinite(parsed) ? parsed : 2_000_000;
}

export function calculateShipping(subtotal: number): number {
  if (subtotal >= getFreeShippingThreshold()) {
    return 0;
  }
  return getShippingFlatRate();
}
