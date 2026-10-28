// All the money rules live in this one file, so they are easy to find and test.
// The numbers come from CLAUDE.md.

var PRICE_ONE_NIGHT = 300;   // RM, when the guest stays only 1 night
var PRICE_MANY_NIGHTS = 250; // RM per night, for EVERY night when staying 2+ nights
var DEPOSIT = 150;           // RM
var CLEANING_COST = 70;      // RM per checkout

// Count nights between two dates written like "2026-10-23".
// We read the dates as UTC so the answer never shifts because of time zones.
function countNights(checkIn, checkOut) {
  var start = Date.parse(checkIn + "T00:00:00Z");
  var end = Date.parse(checkOut + "T00:00:00Z");
  if (isNaN(start) || isNaN(end)) return 0;
  var oneDay = 24 * 60 * 60 * 1000;
  var nights = Math.round((end - start) / oneDay);
  return nights > 0 ? nights : 0;
}

// Work out all the money for a stay of `nights` nights.
function calculatePrice(nights) {
  if (nights < 1) {
    return { nights: 0, pricePerNight: 0, total: 0, deposit: 0, balance: 0, cleaning: 0 };
  }
  var pricePerNight = nights === 1 ? PRICE_ONE_NIGHT : PRICE_MANY_NIGHTS;
  var total = nights * pricePerNight;
  return {
    nights: nights,
    pricePerNight: pricePerNight,
    total: total,
    deposit: DEPOSIT,
    balance: total - DEPOSIT,
    cleaning: CLEANING_COST
  };
}
