// Builds WhatsApp links: fixes the phone number and fills in the message.
// The message wording itself is in messages.js.

var MESSAGE_TYPES = ["rates", "deposit", "confirm", "checkin", "thanks"];

// Turn a phone number as people type it into the format wa.me needs:
// country code + number, digits only, no "+". Returns "" if it can't.
//
//   012-345 6789      -> 60123456789    (Malaysian mobile)
//   082-123456        -> 6082123456     (Kuching landline)
//   0812-3456-7890    -> 6281234567890  (Indonesian mobile)
//   +62 812 3456 7890 -> 6281234567890
function toWhatsAppNumber(phone) {
  var raw = String(phone || "").trim();
  var digits = raw.replace(/\D/g, ""); // keep only 0-9

  if (raw.charAt(0) === "+") {
    // Already has a country code, e.g. +60 or +62. Nothing to change.
  } else if (digits.indexOf("00") === 0) {
    digits = digits.slice(2);            // 0060... is the same as +60...
  } else if (digits.indexOf("60") === 0 || digits.indexOf("62") === 0) {
    // Country code typed without the "+". Nothing to change.
  } else if (digits.indexOf("08") === 0 && digits.length >= 10) {
    // Indonesian mobiles start with 08 and have 10+ digits (0812-3456-789).
    // Sarawak/Sabah landlines also start with 08 but have only 9 (082-123456).
    digits = "62" + digits.slice(1);
  } else if (digits.charAt(0) === "0") {
    digits = "60" + digits.slice(1);     // normal Malaysian number
  } else if (digits.charAt(0) === "1") {
    digits = "60" + digits;              // Malaysian mobile typed without the 0
  } else {
    return "";
  }

  if (digits.length < 10 || digits.length > 15) return "";
  return digits;
}

// Date "2026-11-06" -> "Jumaat, 6 Nov 2026" (in the chosen language).
function formatDate(isoDate, lang) {
  var parts = String(isoDate || "").split("-");
  if (parts.length !== 3) return isoDate;
  var date = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
  var words = DATE_WORDS[lang] || DATE_WORDS.ms;
  return words.days[date.getUTCDay()] + ", " + date.getUTCDate() + " " +
    words.months[date.getUTCMonth()] + " " + date.getUTCFullYear();
}

// Replace every {word} in the text with its value. Unknown words are left as they are.
function fillTemplate(text, values) {
  return text.replace(/\{(\w+)\}/g, function (whole, key) {
    return values[key] !== undefined ? values[key] : whole;
  });
}

// Make the finished message for one booking.
function buildMessage(type, booking, lang) {
  var values = {
    name: booking.name,
    checkIn: formatDate(booking.checkIn, lang),
    checkOut: formatDate(booking.checkOut, lang),
    nights: booking.nights,
    guests: booking.guests,
    total: booking.total,
    deposit: booking.deposit,
    balance: booking.balance,
    priceOneNight: PRICE_ONE_NIGHT,
    priceManyNights: PRICE_MANY_NIGHTS
  };
  for (var key in HOMESTAY_INFO) values[key] = HOMESTAY_INFO[key];
  var templates = MESSAGES[lang] || MESSAGES.ms;
  return fillTemplate(templates[type], values);
}

// The link that opens the guest's WhatsApp chat with the message ready to send.
function whatsAppLink(phone, message) {
  var number = toWhatsAppNumber(phone);
  if (!number) return "";
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}
