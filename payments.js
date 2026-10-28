// Money that has actually come in (payments) and the dashboard numbers.
// No screen code here, only calculations, so tests.html can check them.
//
// A payment looks like:
//   { id, amount: 150, method: "cash" | "duitnow" | "bank",
//     by: "owner" | "helper", transferred: false, date: "2026-10-25" }
// `transferred` only matters when by = "helper": has the helper passed it on to the owner?

var PAYMENT_METHODS = ["cash", "duitnow", "bank"];

// Add up money without odd results like 0.1 + 0.2 = 0.30000000000000004.
function addMoney(a, b) {
  return Math.round((a + b) * 100) / 100;
}

function paymentsOf(booking) {
  return booking.payments || []; // bookings saved before payments existed have none
}

// How much the guest has paid so far.
function paidSoFar(booking) {
  return paymentsOf(booking).reduce(function (sum, p) { return addMoney(sum, p.amount); }, 0);
}

// How much the guest still has to pay (never below zero).
function amountLeft(booking) {
  var left = addMoney(booking.total, -paidSoFar(booking));
  return left > 0 ? left : 0;
}

// Today's date as "2026-10-25", using the phone's own clock.
function todayString() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mm + "-" + dd;
}

// All four dashboard numbers. `today` is a date like "2026-10-25".
function dashboardTotals(bookings, today) {
  var thisMonth = today.slice(0, 7); // "2026-10"
  var result = {
    toCollect: 0, toCollectCount: 0,         // balances guests still owe
    withHelper: 0, withHelperCount: 0,       // money the helper has not passed on yet
    cleaningUnpaid: 0, cleaningUnpaidCount: 0, // cleaning fees not paid yet (after checkout)
    monthIncome: 0,                          // payments received this month
    monthCleaning: 0,                        // cleaning cost for checkouts this month
    monthNet: 0
  };

  bookings.forEach(function (b) {
    var left = amountLeft(b);
    if (left > 0) {
      result.toCollect = addMoney(result.toCollect, left);
      result.toCollectCount++;
    }

    paymentsOf(b).forEach(function (p) {
      if (p.by === "helper" && !p.transferred) {
        result.withHelper = addMoney(result.withHelper, p.amount);
        result.withHelperCount++;
      }
      if (p.date && p.date.slice(0, 7) === thisMonth) {
        result.monthIncome = addMoney(result.monthIncome, p.amount);
      }
    });

    // Cleaning is owed once the guest has checked out (checkout today counts).
    if (b.checkOut <= today && !b.cleaningPaid) {
      result.cleaningUnpaid = addMoney(result.cleaningUnpaid, b.cleaning);
      result.cleaningUnpaidCount++;
    }
    if (b.checkOut.slice(0, 7) === thisMonth) {
      result.monthCleaning = addMoney(result.monthCleaning, b.cleaning);
    }
  });

  result.monthNet = addMoney(result.monthIncome, -result.monthCleaning);
  return result;
}
