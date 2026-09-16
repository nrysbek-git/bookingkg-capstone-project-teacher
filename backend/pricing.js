const EXTRA_PRICES = Object.freeze({ transfer: 1200, guide: 1800, meals: 900 });

function calculateBookingTotal({ price, guests, nights, extras = [], promoCode = '' }) {
  const validExtras = extras.filter(item => Object.hasOwn(EXTRA_PRICES, item));
  const base = Number(price) * Number(guests) * Number(nights);
  const extrasTotal = validExtras.reduce(
    (sum, item) => sum + EXTRA_PRICES[item] * Number(guests),
    0,
  );
  const gross = base + extrasTotal;
  const discount = String(promoCode).trim().toUpperCase() === 'NOMAD10'
    ? Math.round(gross * 0.1)
    : 0;

  return { validExtras, discount, total: gross - discount };
}

module.exports = { EXTRA_PRICES, calculateBookingTotal };
