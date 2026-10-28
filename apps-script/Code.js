// ============================================================
//  HOMESTAY SERVER (Google Apps Script)
//  This runs on Google's computers, not on the phone. It keeps all
//  bookings and payments in the Google Sheet it is attached to.
//
//  Every request from the pages must include a PIN. The PIN decides
//  what the person may do, and that is checked HERE, so changing the
//  page cannot get around it:
//    owner  -> see and change everything
//    helper -> only today's guests: record cash, tick cleaning
//
//  The PINs are NOT in this file. They are saved in
//  Project Settings → Script Properties as OWNER_PIN and HELPER_PIN.
//  The bank details for the deposit message are saved there too, as
//  PAYMENT_DETAILS, and are only sent to the owner page.
// ============================================================

var TIME_ZONE = "Asia/Kuching";
var MAX_WRONG_PINS = 10; // after this many wrong PINs...
var LOCK_MINUTES = 15;   // ...nobody can log in for this long (stops guessing)

var BOOKING_COLUMNS = ["id", "name", "phone", "checkIn", "checkOut", "guests", "source",
  "nights", "total", "deposit", "balance", "cleaning", "cleaningPaid", "msgLang", "createdAt"];
var PAYMENT_COLUMNS = ["id", "bookingId", "amount", "method", "by", "transferred", "date", "createdAt"];
var NUMBER_COLUMNS = ["guests", "nights", "total", "deposit", "balance", "cleaning", "amount"];
var TRUE_FALSE_COLUMNS = ["cleaningPaid", "transferred"];

var ALLOWED_SOURCES = ["poster", "video", "owner_group", "repeat"];
var ALLOWED_METHODS = ["cash", "duitnow", "bank"];
var ALLOWED_RECEIVERS = ["owner", "helper"];
var ALLOWED_MSG_LANGS = ["ms", "id", "en"];

// ---------- Run this once from the editor ----------
// Creates the two tabs in the Sheet and checks the PINs are set.
function setup() {
  getSheet("Bookings", BOOKING_COLUMNS);
  getSheet("Payments", PAYMENT_COLUMNS);
  var props = PropertiesService.getScriptProperties();
  var owner = props.getProperty("OWNER_PIN");
  var helper = props.getProperty("HELPER_PIN");
  if (!owner || !helper) {
    Logger.log("Tabs are ready. PINs are NOT set yet: add OWNER_PIN and HELPER_PIN in Project Settings → Script Properties.");
  } else if (owner === helper) {
    Logger.log("Tabs are ready. PROBLEM: OWNER_PIN and HELPER_PIN are the same. Please make them different.");
  } else if (!props.getProperty("PAYMENT_DETAILS")) {
    Logger.log("Tabs and PINs are ready. Bank details are not set yet: add PAYMENT_DETAILS in Script Properties for the deposit message.");
  } else {
    Logger.log("All good: tabs are ready and both PINs are set.");
  }
}

// ---------- Opening the address in a browser ----------
// Just a quick way to check the server is online.
function doGet() {
  return ContentService.createTextOutput("Homestay server is running.");
}

// ---------- Every request from the pages comes in here ----------
function doPost(e) {
  var result;
  try {
    result = handleRequest(JSON.parse(e.postData.contents));
  } catch (err) {
    result = { ok: false, error: "server", message: String(err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(request) {
  var role = checkPin(request.pin);
  if (role === "locked") return { ok: false, error: "locked" };
  if (!role) return { ok: false, error: "pin" };

  if (request.action === "login") return { ok: true, role: role };

  // The owner may do everything; the helper only the helper actions.
  var action = HELPER_ACTIONS[request.action];
  if (role === "owner" && OWNER_ACTIONS[request.action]) action = OWNER_ACTIONS[request.action];
  if (!action) return { ok: false, error: "notAllowed" };

  // The lock makes two phones saving at the same moment wait their turn.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var result = action(request.data || {});
    result.ok = true;
    result.role = role;
    return result;
  } finally {
    lock.releaseLock();
  }
}

// ---------- PIN check ----------
function checkPin(pin) {
  var cache = CacheService.getScriptCache();
  var wrong = Number(cache.get("wrongPins") || 0);
  if (wrong >= MAX_WRONG_PINS) return "locked";

  var props = PropertiesService.getScriptProperties();
  var role = findRole(pin, {
    owner: props.getProperty("OWNER_PIN"),
    helper: props.getProperty("HELPER_PIN")
  });
  if (!role) cache.put("wrongPins", String(wrong + 1), LOCK_MINUTES * 60);
  return role;
}

// Which role does this PIN belong to? null if none. (Tested in tests.html.)
function findRole(pin, pins) {
  pin = String(pin == null ? "" : pin).trim();
  if (!pin) return null;
  if (pins.owner && pin === String(pins.owner).trim()) return "owner";
  if (pins.helper && pin === String(pins.helper).trim()) return "helper";
  return null;
}

// ---------- Owner actions (each returns the full, fresh list) ----------

// What every owner action sends back: all bookings, plus the bank details
// for the "ask for deposit" WhatsApp message. Those are kept in Script
// Properties so they are never in the public files, and the helper never gets them.
function ownerAnswer() {
  var details = PropertiesService.getScriptProperties().getProperty("PAYMENT_DETAILS");
  return { bookings: allBookings(), paymentDetails: paymentLines(details) };
}

// Script Properties hold one line, so "|" marks a new line:
// "Maybank 1234 | DuitNow 012-345 6789" -> two lines. (Tested in tests.html.)
function paymentLines(text) {
  if (!text) return "";
  return String(text).split("|").map(function (line) { return line.trim(); })
    .filter(function (line) { return line; }).join("\n");
}

var OWNER_ACTIONS = {
  list: function () {
    return ownerAnswer();
  },

  addBooking: function (d) {
    var checkIn = cleanDate(d.checkIn);
    var checkOut = cleanDate(d.checkOut);
    if (checkOut <= checkIn) bad("Check-out must be after check-in");
    var name = cleanText(d.name, 100);
    if (!name) bad("Name is missing");
    appendRow("Bookings", BOOKING_COLUMNS, {
      id: Utilities.getUuid(),
      name: name,
      phone: cleanText(d.phone, 30),
      checkIn: checkIn,
      checkOut: checkOut,
      guests: cleanNumber(d.guests, 1, 50),
      source: oneOf(d.source, ALLOWED_SOURCES),
      nights: cleanNumber(d.nights, 1, 365),
      total: cleanNumber(d.total, 0, 1000000),
      deposit: cleanNumber(d.deposit, 0, 1000000),
      balance: cleanNumber(d.balance, -1000000, 1000000),
      cleaning: cleanNumber(d.cleaning, 0, 10000),
      cleaningPaid: false,
      msgLang: "ms",
      createdAt: nowString()
    });
    return ownerAnswer();
  },

  updateBooking: function (d) {
    var changes = {};
    if (d.changes && d.changes.cleaningPaid !== undefined) changes.cleaningPaid = d.changes.cleaningPaid === true;
    if (d.changes && d.changes.msgLang !== undefined) changes.msgLang = oneOf(d.changes.msgLang, ALLOWED_MSG_LANGS);
    updateRow("Bookings", BOOKING_COLUMNS, d.id, changes);
    return ownerAnswer();
  },

  deleteBooking: function (d) {
    deleteRows("Bookings", BOOKING_COLUMNS, "id", d.id);
    deleteRows("Payments", PAYMENT_COLUMNS, "bookingId", d.id);
    return ownerAnswer();
  },

  addPayment: function (d) {
    if (findRow("Bookings", BOOKING_COLUMNS, d.bookingId) < 0) bad("Booking not found");
    appendRow("Payments", PAYMENT_COLUMNS, {
      id: Utilities.getUuid(),
      bookingId: d.bookingId,
      amount: cleanNumber(d.amount, 0.01, 1000000),
      method: oneOf(d.method, ALLOWED_METHODS),
      by: oneOf(d.by, ALLOWED_RECEIVERS),
      transferred: false,
      date: cleanDate(d.date),
      createdAt: nowString()
    });
    return ownerAnswer();
  },

  setTransferred: function (d) {
    updateRow("Payments", PAYMENT_COLUMNS, d.paymentId, { transferred: d.transferred === true });
    return ownerAnswer();
  },

  deletePayment: function (d) {
    deleteRows("Payments", PAYMENT_COLUMNS, "id", d.paymentId);
    return ownerAnswer();
  }
};

// ---------- Helper actions (each returns today's view only) ----------
var HELPER_ACTIONS = {
  today: function () {
    return helperTodayView(allBookings(), todayInKuching());
  },

  // Record everything still owed as cash the helper is holding.
  // The server works out the amount, so the page can't send a wrong number.
  cashReceived: function (d) {
    var today = todayInKuching();
    var booking = findTodaysBooking(d.bookingId, today);
    var left = leftToPay(booking);
    if (left > 0) {
      appendRow("Payments", PAYMENT_COLUMNS, {
        id: Utilities.getUuid(),
        bookingId: booking.id,
        amount: left,
        method: "cash",
        by: "helper",
        transferred: false,
        date: today,
        createdAt: nowString()
      });
    }
    return helperTodayView(allBookings(), today);
  },

  setCleaning: function (d) {
    var today = todayInKuching();
    var booking = findTodaysBooking(d.bookingId, today);
    if (booking.checkOut !== today) bad("Cleaning can only be ticked on check-out day");
    updateRow("Bookings", BOOKING_COLUMNS, booking.id, { cleaningPaid: d.done === true });
    return helperTodayView(allBookings(), today);
  }
};

// The helper may only touch bookings that arrive or leave today.
function findTodaysBooking(id, today) {
  var booking = allBookings().filter(function (b) { return b.id === id; })[0];
  if (!booking || (booking.checkIn !== today && booking.checkOut !== today)) bad("Not one of today's guests");
  return booking;
}

// ---------- Calculations (no Sheet needed, tested in tests.html) ----------

function leftToPay(booking) {
  var paid = (booking.payments || []).reduce(function (sum, p) { return sum + p.amount; }, 0);
  var left = Math.round((booking.total - paid) * 100) / 100;
  return left > 0 ? left : 0;
}

// Only what the helper needs: today's guests, phone, amount left, cleaning tick.
function helperTodayView(bookings, today) {
  function short(b) {
    return { id: b.id, name: b.name, phone: b.phone, left: leftToPay(b), cleaningPaid: b.cleaningPaid };
  }
  return {
    today: today,
    checkIns: bookings.filter(function (b) { return b.checkIn === today; }).map(short),
    checkOuts: bookings.filter(function (b) { return b.checkOut === today; }).map(short)
  };
}

// One Sheet row (all text) -> an object with proper numbers and true/false.
function rowToObject(row, columns) {
  var obj = {};
  columns.forEach(function (col, i) {
    var value = row[i];
    if (NUMBER_COLUMNS.indexOf(col) !== -1) value = Number(String(value).replace(/,/g, "")) || 0;
    else if (TRUE_FALSE_COLUMNS.indexOf(col) !== -1) value = String(value).toUpperCase() === "TRUE";
    obj[col] = value;
  });
  return obj;
}

// ---------- Checking what the pages send ----------
function bad(message) {
  throw new Error(message);
}

function cleanText(value, maxLength) {
  var text = String(value == null ? "" : value).trim();
  if (text.length > maxLength) bad("Text is too long");
  return text;
}

function cleanNumber(value, min, max) {
  var n = Number(value);
  if (!isFinite(n) || n < min || n > max) bad("Number out of range");
  return Math.round(n * 100) / 100;
}

function cleanDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) bad("Bad date");
  return String(value);
}

function oneOf(value, allowed) {
  if (allowed.indexOf(value) === -1) bad("Not an allowed choice");
  return value;
}

// ---------- Reading and writing the Sheet ----------

function todayInKuching() {
  return Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd");
}

function nowString() {
  return Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm");
}

// Get a tab, creating it with headings if it doesn't exist yet.
function getSheet(name, columns) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    // Text columns are set to "plain text" so Sheets never changes them:
    // phone 012... keeps its 0, dates stay as 2026-10-25, and a name
    // starting with = is not treated as a formula.
    columns.forEach(function (col, i) {
      if (NUMBER_COLUMNS.indexOf(col) === -1 && TRUE_FALSE_COLUMNS.indexOf(col) === -1) {
        sheet.getRange(1, i + 1, sheet.getMaxRows(), 1).setNumberFormat("@");
      }
    });
  }
  return sheet;
}

function readRows(name, columns) {
  var sheet = getSheet(name, columns);
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, columns.length).getDisplayValues()
    .map(function (row) { return rowToObject(row, columns); });
}

// All bookings, each with its list of payments inside.
function allBookings() {
  var payments = readRows("Payments", PAYMENT_COLUMNS);
  return readRows("Bookings", BOOKING_COLUMNS).map(function (b) {
    b.payments = payments.filter(function (p) { return p.bookingId === b.id; });
    return b;
  });
}

function appendRow(name, columns, obj) {
  getSheet(name, columns).appendRow(columns.map(function (col) {
    return obj[col] === undefined ? "" : obj[col];
  }));
}

// Row number of the row whose id (column A) matches, or -1.
function findRow(name, columns, id) {
  var sheet = getSheet(name, columns);
  var last = sheet.getLastRow();
  if (!id || last < 2) return -1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getDisplayValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return -1;
}

function updateRow(name, columns, id, changes) {
  var row = findRow(name, columns, id);
  if (row < 0) bad("Not found");
  var sheet = getSheet(name, columns);
  for (var key in changes) {
    sheet.getRange(row, columns.indexOf(key) + 1).setValue(changes[key]);
  }
}

// Delete every row where `column` equals `value` (bottom up, so row numbers don't shift).
function deleteRows(name, columns, column, value) {
  var sheet = getSheet(name, columns);
  var last = sheet.getLastRow();
  if (!value || last < 2) return;
  var col = columns.indexOf(column) + 1;
  var values = sheet.getRange(2, col, last - 1, 1).getDisplayValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] === value) sheet.deleteRow(i + 2);
  }
}
