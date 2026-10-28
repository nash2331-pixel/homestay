// This file runs the page: the form, the language switch, saving bookings,
// payments and the dashboard.
// The money rules are in pricing.js and payments.js.

// ---------- Words in both languages ----------
// Bahasa Melayu is the default. Simple everyday words, not formal BM.
var WORDS = {
  ms: {
    title: "Tempahan Baru",
    langBtn: "English",
    name: "Nama tetamu",
    phone: "No. telefon",
    checkIn: "Tarikh masuk",
    checkOut: "Tarikh keluar",
    guests: "Berapa orang",
    source: "Tahu pasal homestay dari mana?",
    src_poster: "Poster",
    src_video: "Video",
    src_owner_group: "Group owner",
    src_repeat: "Pernah datang",
    nights: "Malam",
    total: "Jumlah",
    deposit: "Deposit",
    balance: "Baki bayar masa sampai",
    cleaning: "Kos cuci",
    save: "Simpan",
    list: "Senarai tempahan",
    empty: "Belum ada tempahan.",
    delete: "Padam",
    confirmDelete: "Padam tempahan ini?",
    err_name: "Tolong isi nama tetamu.",
    err_dates: "Tarikh keluar mesti lepas tarikh masuk.",
    err_source: "Tolong pilih dari mana tetamu tahu.",
    err_phone: "No. telefon tak betul. Contoh: 012-345 6789 atau +62 812 3456 7890",
    guestsWord: "orang",
    nightsWord: "malam",
    wa_title: "WhatsApp",
    wa_no_phone: "Tiada no. telefon yang betul, tak boleh buka WhatsApp.",
    msg_rates: "Harga",
    msg_deposit: "Minta deposit",
    msg_confirm: "Sahkan tempahan",
    msg_checkin: "Info masuk",
    msg_thanks: "Terima kasih",
    dash_title: "Ringkasan",
    dash_toCollect: "Belum kutip",
    dash_withHelper: "Duit dengan helper",
    dash_cleaning: "Kos cuci belum bayar",
    dash_month: "Untung bulan ni",
    dash_bookings: "tempahan",
    dash_notTransferred: "bayaran belum transfer",
    dash_cleanings: "kali cuci",
    dash_in: "Masuk",
    dash_clean: "cuci",
    paid: "Dah bayar",
    left: "Tinggal",
    fullyPaid: "Dah bayar penuh ✓",
    cl_paid: "dah bayar ✓",
    cl_unpaid: "belum bayar",
    pay_title: "Bayaran",
    pay_none: "Belum ada bayaran.",
    pay_add: "Tambah bayaran",
    pay_amount: "Berapa (RM)",
    pay_deposit: "Deposit",
    pay_rest: "Baki",
    pay_method: "Cara bayar",
    m_cash: "Tunai",
    m_duitnow: "DuitNow",
    m_bank: "Bank transfer",
    pay_by: "Siapa terima",
    by_owner: "Owner",
    by_helper: "Helper",
    pay_date: "Tarikh bayar",
    pay_save: "Simpan bayaran",
    pay_err: "Tolong isi berapa, cara bayar dan siapa terima.",
    notTransferred: "Belum transfer ke owner",
    transferred: "Dah transfer ke owner ✓",
    confirmDeletePay: "Padam bayaran ini?",
    helperLink: "Buka paparan helper →",
    pin_title: "Masukkan PIN",
    pin_btn: "Masuk",
    logout: "Log keluar",
    loading: "Sekejap...",
    err_pin: "PIN salah. Cuba lagi.",
    err_notAllowed: "PIN ni tak boleh buka page ni.",
    err_locked: "Terlalu banyak PIN salah. Tunggu 15 minit.",
    err_network: "Tak dapat sambung. Check internet dan cuba lagi.",
    err_server: "Ada masalah:",
    err_noServer: "Alamat server belum diisi dalam config.js."
  },
  en: {
    title: "New Booking",
    langBtn: "Bahasa",
    name: "Guest name",
    phone: "Phone number",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Number of guests",
    source: "How did they find us?",
    src_poster: "Poster",
    src_video: "Video",
    src_owner_group: "Owner group",
    src_repeat: "Repeat guest",
    nights: "Nights",
    total: "Total",
    deposit: "Deposit",
    balance: "Balance on arrival",
    cleaning: "Cleaning cost",
    save: "Save",
    list: "Bookings",
    empty: "No bookings yet.",
    delete: "Delete",
    confirmDelete: "Delete this booking?",
    err_name: "Please enter the guest name.",
    err_dates: "Check-out must be after check-in.",
    err_source: "Please pick how they found us.",
    err_phone: "Phone number looks wrong. Example: 012-345 6789 or +62 812 3456 7890",
    guestsWord: "guests",
    nightsWord: "nights",
    wa_title: "WhatsApp",
    wa_no_phone: "No valid phone number, so WhatsApp can't be opened.",
    msg_rates: "Rates",
    msg_deposit: "Ask for deposit",
    msg_confirm: "Confirm booking",
    msg_checkin: "Check-in info",
    msg_thanks: "Thank you",
    dash_title: "Summary",
    dash_toCollect: "Still to collect",
    dash_withHelper: "Money with helper",
    dash_cleaning: "Unpaid cleaning",
    dash_month: "This month's profit",
    dash_bookings: "bookings",
    dash_notTransferred: "payments not transferred",
    dash_cleanings: "cleanings",
    dash_in: "In",
    dash_clean: "cleaning",
    paid: "Paid",
    left: "Left",
    fullyPaid: "Fully paid ✓",
    cl_paid: "paid ✓",
    cl_unpaid: "not paid",
    pay_title: "Payments",
    pay_none: "No payments yet.",
    pay_add: "Add payment",
    pay_amount: "Amount (RM)",
    pay_deposit: "Deposit",
    pay_rest: "Balance",
    pay_method: "Method",
    m_cash: "Cash",
    m_duitnow: "DuitNow",
    m_bank: "Bank transfer",
    pay_by: "Received by",
    by_owner: "Owner",
    by_helper: "Helper",
    pay_date: "Date paid",
    pay_save: "Save payment",
    pay_err: "Please fill in the amount, method and who received it.",
    notTransferred: "Not transferred to owner",
    transferred: "Transferred to owner ✓",
    confirmDeletePay: "Delete this payment?",
    helperLink: "Open helper view →",
    pin_title: "Enter PIN",
    pin_btn: "Enter",
    logout: "Log out",
    loading: "One moment...",
    err_pin: "Wrong PIN. Try again.",
    err_notAllowed: "This PIN can't open this page.",
    err_locked: "Too many wrong PINs. Wait 15 minutes.",
    err_network: "Can't connect. Check the internet and try again.",
    err_server: "Something went wrong:",
    err_noServer: "The server address is not filled in config.js yet."
  }
};

// ---------- Page state ----------
// load() and save() are in storage.js. Bookings come from the server (api.js).
var lang = load("lang", "ms");
var bookings = [];
var guests = 2;
var source = null;
var openSections = {}; // which fold-out sections are open, so they stay open after a redraw

function t(key) {
  return WORDS[lang][key];
}

// 1250 -> "RM1,250"
function rm(amount) {
  return "RM" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function $(id) {
  return document.getElementById(id);
}

// Small helper to create an element with a class and text in one line.
function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent shows names safely
  return node;
}

// A row of big tap buttons where one can be picked (like the source buttons).
// options: [["cash", "Tunai"], ...]. onPick(value) is called when one is tapped.
function choiceButtons(options, onPick) {
  var row = el("div", "choices");
  options.forEach(function (pair) {
    var btn = el("button", "", pair[1]);
    btn.type = "button";
    btn.onclick = function () {
      row.querySelectorAll("button").forEach(function (b) { b.classList.remove("picked"); });
      btn.classList.add("picked");
      onPick(pair[0]);
    };
    row.appendChild(btn);
  });
  return row;
}

// A fold-out section (tap the title to open/close) that remembers if it was open.
function foldOut(key, title) {
  var box = el("details", "fold");
  if (openSections[key]) box.open = true;
  box.ontoggle = function () { openSections[key] = box.open; };
  box.appendChild(el("summary", "", title));
  return box;
}

// After every change the server sends back the full, fresh list.
function useServerAnswer(result) {
  bookings = result.bookings;
  showBookings();
}

// ---------- Show words in the chosen language ----------
function applyLanguage() {
  document.documentElement.lang = lang;
  var items = document.querySelectorAll("[data-text]");
  for (var i = 0; i < items.length; i++) {
    items[i].textContent = t(items[i].getAttribute("data-text"));
  }
  $("langBtn").textContent = t("langBtn");
  showBookings();
}

// ---------- Live price summary ----------
function updateSummary() {
  var nights = countNights($("checkIn").value, $("checkOut").value);
  var price = calculatePrice(nights);
  $("sumNights").textContent = price.nights;
  $("sumTotal").textContent = rm(price.total);
  $("sumDeposit").textContent = rm(price.deposit);
  $("sumBalance").textContent = rm(price.balance);
  $("sumCleaning").textContent = rm(price.cleaning);
}

// ---------- Dashboard ----------
function showDashboard() {
  var d = dashboardTotals(bookings, todayString());
  var box = $("dashboard");
  box.innerHTML = "";

  function tile(title, amount, detail, warn) {
    var card = el("div", "tile" + (warn ? " warn" : ""));
    card.append(el("div", "tile-title", title), el("div", "tile-amount", rm(amount)), el("div", "tile-detail", detail));
    box.appendChild(card);
  }

  tile(t("dash_toCollect"), d.toCollect, d.toCollectCount + " " + t("dash_bookings"), d.toCollect > 0);
  tile(t("dash_withHelper"), d.withHelper, d.withHelperCount + " " + t("dash_notTransferred"), d.withHelper > 0);
  tile(t("dash_cleaning"), d.cleaningUnpaid, d.cleaningUnpaidCount + " " + t("dash_cleanings"), d.cleaningUnpaid > 0);
  tile(t("dash_month"), d.monthNet,
    t("dash_in") + " " + rm(d.monthIncome) + " − " + t("dash_clean") + " " + rm(d.monthCleaning), false);
}

// ---------- Booking list ----------
function showBookings() {
  showDashboard();
  var box = $("bookings");
  box.innerHTML = "";
  if (bookings.length === 0) {
    box.innerHTML = '<p class="empty">' + t("empty") + "</p>";
    return;
  }
  // Soonest check-in first, so upcoming guests are at the top.
  var sorted = bookings.slice().sort(function (a, b) {
    return a.checkIn < b.checkIn ? -1 : 1;
  });
  sorted.forEach(function (b) {
    var card = el("div", "booking");

    var line1 = el("div", "small", formatDate(b.checkIn, lang) + " → " + formatDate(b.checkOut, lang) + " · " +
      b.nights + " " + t("nightsWord") + " · " + b.guests + " " + t("guestsWord"));

    // Show the number the way WhatsApp will use it, so it is easy to spot a mistake.
    var number = toWhatsAppNumber(b.phone);
    var shownPhone = number ? "+" + number : b.phone;
    var line2 = el("div", "small", (shownPhone ? shownPhone + " · " : "") + t("src_" + b.source));

    var left = amountLeft(b);
    var line3 = el("div", "money", left > 0
      ? t("total") + " " + rm(b.total) + " · " + t("paid") + " " + rm(paidSoFar(b)) + " · " + t("left") + " " + rm(left)
      : t("total") + " " + rm(b.total) + " · " + t("fullyPaid"));

    // Tap to mark the cleaning fee as paid / not paid.
    var cleaningBtn = el("button", "toggle" + (b.cleaningPaid ? " done" : ""),
      t("cleaning") + " " + rm(b.cleaning) + ": " + (b.cleaningPaid ? t("cl_paid") : t("cl_unpaid")));
    cleaningBtn.type = "button";
    cleaningBtn.onclick = function () {
      api("updateBooking", { id: b.id, changes: { cleaningPaid: !b.cleaningPaid } }).then(useServerAnswer);
    };

    var del = el("button", "delete-btn", t("delete"));
    del.type = "button";
    del.onclick = function () {
      if (confirm(t("confirmDelete"))) {
        api("deleteBooking", { id: b.id }).then(useServerAnswer);
      }
    };

    card.append(el("div", "name", b.name), line1, line2, line3, cleaningBtn,
      buildPaymentsSection(b), buildWhatsAppSection(b), del);
    box.appendChild(card);
  });
}

// The "Payments" part of a booking card: list of payments and a form to add one.
function buildPaymentsSection(b) {
  var box = foldOut("pay-" + b.id, t("pay_title"));
  var payments = paymentsOf(b);

  if (payments.length === 0) box.appendChild(el("p", "small", t("pay_none")));

  payments.forEach(function (p) {
    var row = el("div", "payment");
    row.appendChild(el("div", "payment-line",
      rm(p.amount) + " · " + t("m_" + p.method) + " · " + t("by_" + p.by) + " · " + formatDate(p.date, lang)));

    // Only money the helper received needs passing on to the owner.
    if (p.by === "helper") {
      var transferBtn = el("button", "toggle" + (p.transferred ? " done" : ""),
        p.transferred ? t("transferred") : t("notTransferred"));
      transferBtn.type = "button";
      transferBtn.onclick = function () {
        api("setTransferred", { paymentId: p.id, transferred: !p.transferred }).then(useServerAnswer);
      };
      row.appendChild(transferBtn);
    }

    var delPay = el("button", "delete-btn", t("delete"));
    delPay.type = "button";
    delPay.onclick = function () {
      if (confirm(t("confirmDeletePay"))) {
        api("deletePayment", { paymentId: p.id }).then(useServerAnswer);
      }
    };
    row.appendChild(delPay);
    box.appendChild(row);
  });

  // ----- Add a payment -----
  box.appendChild(el("h3", "", t("pay_add")));
  var method = null;
  var by = null;

  box.appendChild(el("label", "", t("pay_amount")));
  var amountInput = el("input");
  amountInput.type = "number";
  amountInput.inputMode = "decimal";
  amountInput.min = "0";
  amountInput.step = "0.01";

  // Quick-fill buttons so most payments need no typing.
  var quick = el("div", "quick");
  function quickButton(label, amount) {
    var btn = el("button", "", label + " " + rm(amount));
    btn.type = "button";
    btn.onclick = function () { amountInput.value = amount; };
    quick.appendChild(btn);
  }
  if (payments.length === 0) quickButton(t("pay_deposit"), b.deposit);
  if (amountLeft(b) > 0) quickButton(t("pay_rest"), amountLeft(b));
  box.append(quick, amountInput);

  box.appendChild(el("label", "", t("pay_method")));
  box.appendChild(choiceButtons(PAYMENT_METHODS.map(function (m) { return [m, t("m_" + m)]; }),
    function (value) { method = value; }));

  box.appendChild(el("label", "", t("pay_by")));
  box.appendChild(choiceButtons([["owner", t("by_owner")], ["helper", t("by_helper")]],
    function (value) { by = value; }));

  box.appendChild(el("label", "", t("pay_date")));
  var dateInput = el("input");
  dateInput.type = "date";
  dateInput.value = todayString();
  box.appendChild(dateInput);

  var error = el("p", "error");
  var saveBtn = el("button", "save-btn", t("pay_save"));
  saveBtn.type = "button";
  saveBtn.onclick = function () {
    var amount = Math.round(parseFloat(amountInput.value) * 100) / 100;
    if (!(amount > 0) || !method || !by || !dateInput.value) {
      error.textContent = t("pay_err");
      return;
    }
    api("addPayment", {
      bookingId: b.id,
      amount: amount,
      method: method,
      by: by,
      date: dateInput.value
    }).then(useServerAnswer);
  };
  box.append(error, saveBtn);
  return box;
}

// The "WhatsApp" part of a booking card: pick the message language,
// then tap a button to open the guest's chat with the message ready.
function buildWhatsAppSection(b) {
  var box = foldOut("wa-" + b.id, t("wa_title"));

  if (!toWhatsAppNumber(b.phone)) {
    box.appendChild(el("p", "small", t("wa_no_phone")));
    return box;
  }

  // Message language is saved per booking. Older bookings default to BM.
  var msgLang = b.msgLang || "ms";
  var langRow = el("div", "msg-langs");
  [["ms", "BM"], ["id", "Indonesia"], ["en", "English"]].forEach(function (pair) {
    var btn = el("button", pair[0] === msgLang ? "picked" : "", pair[1]);
    btn.type = "button";
    btn.onclick = function () {
      api("updateBooking", { id: b.id, changes: { msgLang: pair[0] } }).then(useServerAnswer);
    };
    langRow.appendChild(btn);
  });
  box.appendChild(langRow);

  MESSAGE_TYPES.forEach(function (type) {
    var link = el("a", "wa-btn", t("msg_" + type));
    link.href = whatsAppLink(b.phone, buildMessage(type, b, msgLang));
    link.target = "_blank";
    link.rel = "noopener";
    box.appendChild(link);
  });
  return box;
}

// ---------- Buttons and form ----------
$("langBtn").onclick = function () {
  lang = lang === "ms" ? "en" : "ms";
  save("lang", lang);
  applyLanguage();
};

$("guestsMinus").onclick = function () {
  if (guests > 1) guests--;
  $("guestsCount").textContent = guests;
};

$("guestsPlus").onclick = function () {
  guests++;
  $("guestsCount").textContent = guests;
};

var sourceButtons = document.querySelectorAll("#sourceChoices button");
sourceButtons.forEach(function (btn) {
  btn.onclick = function () {
    source = btn.getAttribute("data-source");
    sourceButtons.forEach(function (b) { b.classList.remove("picked"); });
    btn.classList.add("picked");
  };
});

$("checkIn").onchange = updateSummary;
$("checkOut").onchange = updateSummary;

$("form").onsubmit = function (event) {
  event.preventDefault();   // stop the page from reloading

  var name = $("name").value.trim();
  var phone = $("phone").value.trim();
  var nights = countNights($("checkIn").value, $("checkOut").value);

  if (!name) { $("error").textContent = t("err_name"); return; }
  if (phone && !toWhatsAppNumber(phone)) { $("error").textContent = t("err_phone"); return; }
  if (nights < 1) { $("error").textContent = t("err_dates"); return; }
  if (!source) { $("error").textContent = t("err_source"); return; }
  $("error").textContent = "";

  var price = calculatePrice(nights);
  api("addBooking", {
    name: name,
    phone: phone,
    checkIn: $("checkIn").value,
    checkOut: $("checkOut").value,
    guests: guests,
    source: source,
    nights: price.nights,
    total: price.total,
    deposit: price.deposit,
    balance: price.balance,
    cleaning: price.cleaning
  }).then(function (result) {
    useServerAnswer(result);
    // Clear the form for the next booking (only once it is safely saved).
    $("form").reset();
    guests = 2;
    $("guestsCount").textContent = guests;
    source = null;
    sourceButtons.forEach(function (b) { b.classList.remove("picked"); });
    updateSummary();
  });
};

$("logoutBtn").onclick = logout;

// Start up: show words, then ask for the PIN (or use the saved one) and load bookings.
applyLanguage();
updateSummary();
setupPin(function () {
  api("list").then(useServerAnswer);
});
