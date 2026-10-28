// The helper page: today's check-ins and check-outs only.
// The server (Google Apps Script) only ever sends today's guests to this page.

var WORDS = {
  ms: {
    title: "Hari ni",
    checkIns: "Masuk hari ni",
    checkOuts: "Keluar hari ni",
    none: "Tiada.",
    collect: "Kutip",
    fullyPaid: "Dah bayar penuh ✓",
    cashBtn: "Terima tunai",
    confirmCash: "Dah terima tunai",
    from: "dari",
    cleaning: "Cuci siap & dah bayar",
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
    title: "Today",
    checkIns: "Arriving today",
    checkOuts: "Leaving today",
    none: "None.",
    collect: "Collect",
    fullyPaid: "Fully paid ✓",
    cashBtn: "Cash received",
    confirmCash: "Received cash",
    from: "from",
    cleaning: "Cleaning done & paid",
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

// Uses the same language the owner picked on this phone (BM if never set).
var lang = load("lang", "ms");

function t(key) {
  return WORDS[lang][key];
}

function rm(amount) {
  return "RM" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// One guest card. Check-out cards also get the cleaning tick.
// g has: id, name, phone, left (amount still owed), cleaningPaid.
function guestCard(g, isCheckOut) {
  var card = el("div", "card");
  card.appendChild(el("div", "name", g.name));

  // Tap the number to call the guest.
  if (g.phone) {
    var number = toWhatsAppNumber(g.phone);
    var phone = el("a", "phone", "📞 " + (number ? "+" + number : g.phone));
    phone.href = "tel:" + (number ? "+" + number : g.phone);
    card.appendChild(phone);
  }

  if (g.left > 0) {
    card.appendChild(el("div", "collect", t("collect") + " " + rm(g.left)));
    var cashBtn = el("button", "big-btn cash-btn", "💵 " + t("cashBtn") + " " + rm(g.left));
    cashBtn.type = "button";
    cashBtn.onclick = function () {
      // Ask first, so a wrong tap doesn't record money.
      if (confirm(t("confirmCash") + " " + rm(g.left) + " " + t("from") + " " + g.name + "?")) {
        api("cashReceived", { bookingId: g.id }).then(render);
      }
    };
    card.appendChild(cashBtn);
  } else {
    card.appendChild(el("div", "paid", t("fullyPaid")));
  }

  if (isCheckOut) {
    var tick = el("button", "big-btn tick-btn" + (g.cleaningPaid ? " done" : ""),
      (g.cleaningPaid ? "✅ " : "⬜ ") + t("cleaning"));
    tick.type = "button";
    tick.onclick = function () {
      api("setCleaning", { bookingId: g.id, done: !g.cleaningPaid }).then(render);
    };
    card.appendChild(tick);
  }
  return card;
}

function showList(boxId, list, isCheckOut) {
  var box = document.getElementById(boxId);
  box.innerHTML = "";
  if (list.length === 0) box.appendChild(el("p", "none", t("none")));
  list.forEach(function (g) { box.appendChild(guestCard(g, isCheckOut)); });
}

// Draw the page from the server's answer: { today, checkIns, checkOuts }.
function render(view) {
  document.getElementById("today").textContent = formatDate(view.today, lang);
  showList("checkIns", view.checkIns, false);
  showList("checkOuts", view.checkOuts, true);
}

function loadToday() {
  api("today").then(render);
}

// Words that don't change.
document.documentElement.lang = lang;
document.querySelectorAll("[data-text]").forEach(function (node) {
  node.textContent = t(node.getAttribute("data-text"));
});
document.getElementById("logoutBtn").onclick = logout;

// Reload when the helper comes back to the page, so it is always up to date.
document.addEventListener("visibilitychange", function () {
  if (!document.hidden && load("pin", "")) loadToday();
});

setupPin(loadToday);
