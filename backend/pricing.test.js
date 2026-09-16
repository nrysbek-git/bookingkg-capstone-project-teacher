const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateBookingTotal } = require('./pricing');

test('calculates base price and selected services', () => {
  const result = calculateBookingTotal({
    price: 4500,
    guests: 2,
    nights: 3,
    extras: ['transfer', 'guide'],
  });
  assert.equal(result.total, 33000);
  assert.equal(result.discount, 0);
});

test('applies NOMAD10 and ignores unknown services', () => {
  const result = calculateBookingTotal({
    price: 5000,
    guests: 1,
    nights: 2,
    extras: ['meals', 'unknown'],
    promoCode: ' nomad10 ',
  });
  assert.deepEqual(result.validExtras, ['meals']);
  assert.equal(result.discount, 1090);
  assert.equal(result.total, 9810);
});
