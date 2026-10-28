// ============================================================
//  ALL WHATSAPP MESSAGE WORDING IS IN THIS FILE.
//  Change the text freely. Just keep these rules:
//   - Keep the quotes ` ` around each message.
//   - Words in {curly brackets} are filled in automatically.
//     Do not translate them. You can move or remove them.
//   - *stars* make text bold in WhatsApp.
// ============================================================

// ---------- 1. Your homestay details (FILL THESE IN) ----------
// Anything that still says ISI ... must be replaced before sending.
var HOMESTAY_INFO = {
  address: "ISI ALAMAT HOMESTAY",
  mapLink: "ISI LINK GOOGLE MAPS",
  checkInTime: "ISI MASA MASUK (contoh: 2:00 PM)",
  checkOutTime: "ISI MASA KELUAR (contoh: 12:00 PM)",
  paymentDetails:
    "Bank: ISI NAMA BANK\n" +
    "No. akaun: ISI NO. AKAUN\n" +
    "Nama: ISI NAMA PEMILIK AKAUN\n" +
    "DuitNow: ISI NO. DUITNOW"
};

// ---------- 2. Words you can use inside messages ----------
// {name}            guest name
// {checkIn}         check-in date, e.g. Friday, 6 Nov 2026
// {checkOut}        check-out date
// {nights}          number of nights
// {guests}          number of guests
// {total}           total price (number only, write RM in front)
// {deposit}         deposit
// {balance}         balance to pay on arrival
// {priceOneNight}   price for 1 night (from pricing.js)
// {priceManyNights} price per night for 2+ nights (from pricing.js)
// {address} {mapLink} {checkInTime} {checkOutTime} {paymentDetails}
//                   from HOMESTAY_INFO above

// ---------- 3. The messages ----------
var MESSAGES = {

  // ----- Bahasa Melayu -----
  ms: {
    rates:
`Hai {name}! Terima kasih sebab berminat dengan homestay kami di Kuching 😊

Harga:
• 1 malam: RM{priceOneNight}
• 2 malam ke atas: RM{priceManyNights} semalam

Untuk {checkIn} sampai {checkOut} ({nights} malam), jumlahnya *RM{total}*.
Deposit RM{deposit} untuk sahkan tarikh, baki bayar masa sampai.`,

    deposit:
`Hai {name}, untuk sahkan tempahan {checkIn} sampai {checkOut}, boleh bayar deposit *RM{deposit}* ke:

{paymentDetails}

Lepas bayar, tolong hantar resit kat sini ya. Terima kasih!`,

    confirm:
`Hai {name}, tempahan dah sah ✅

📅 Masuk: {checkIn}
📅 Keluar: {checkOut}
🌙 {nights} malam, {guests} orang
💰 Jumlah: RM{total}
✔️ Deposit: RM{deposit} (dah terima)
💵 Baki bayar masa sampai: *RM{balance}*

Jumpa nanti!`,

    checkin:
`Hai {name}, ini info untuk masuk homestay pada {checkIn}:

📍 Alamat: {address}
🗺️ Peta: {mapLink}
🕑 Masuk: lepas {checkInTime}
🕛 Keluar: sebelum {checkOutTime}
💵 Baki *RM{balance}* bayar masa sampai (tunai, DuitNow atau bank transfer).

Kalau ada apa-apa, WhatsApp je. Selamat datang!`,

    thanks:
`Hai {name}, terima kasih sebab menginap dengan kami! 🙏
Harap semua ok. Kalau datang Kuching lagi, roger je ya 😊`
  },

  // ----- Bahasa Indonesia -----
  id: {
    rates:
`Halo {name}! Terima kasih sudah tertarik dengan homestay kami di Kuching 😊

Harga:
• 1 malam: RM{priceOneNight}
• 2 malam atau lebih: RM{priceManyNights} per malam

Untuk {checkIn} sampai {checkOut} ({nights} malam), totalnya *RM{total}*.
Deposit RM{deposit} untuk mengamankan tanggal, sisanya dibayar saat tiba.`,

    deposit:
`Halo {name}, untuk mengonfirmasi pemesanan {checkIn} sampai {checkOut}, silakan transfer deposit *RM{deposit}* ke:

{paymentDetails}

Setelah transfer, mohon kirim bukti pembayarannya di sini ya. Terima kasih!`,

    confirm:
`Halo {name}, pemesanan sudah terkonfirmasi ✅

📅 Check-in: {checkIn}
📅 Check-out: {checkOut}
🌙 {nights} malam, {guests} orang
💰 Total: RM{total}
✔️ Deposit: RM{deposit} (sudah diterima)
💵 Sisa dibayar saat tiba: *RM{balance}*

Sampai jumpa!`,

    checkin:
`Halo {name}, ini info check-in untuk tanggal {checkIn}:

📍 Alamat: {address}
🗺️ Peta: {mapLink}
🕑 Check-in: setelah {checkInTime}
🕛 Check-out: sebelum {checkOutTime}
💵 Sisa *RM{balance}* dibayar saat tiba (tunai, DuitNow atau transfer bank).

Kalau ada apa-apa, WhatsApp saja. Selamat datang!`,

    thanks:
`Halo {name}, terima kasih sudah menginap di tempat kami! 🙏
Semoga semuanya menyenangkan. Kalau ke Kuching lagi, kabari kami ya 😊`
  },

  // ----- English -----
  en: {
    rates:
`Hi {name}! Thanks for your interest in our homestay in Kuching 😊

Rates:
• 1 night: RM{priceOneNight}
• 2 nights or more: RM{priceManyNights} per night

For {checkIn} to {checkOut} ({nights} nights), the total is *RM{total}*.
A RM{deposit} deposit secures your dates, and the balance is paid on arrival.`,

    deposit:
`Hi {name}, to confirm your booking for {checkIn} to {checkOut}, please pay the *RM{deposit}* deposit to:

{paymentDetails}

Once paid, please send the receipt here. Thank you!`,

    confirm:
`Hi {name}, your booking is confirmed ✅

📅 Check-in: {checkIn}
📅 Check-out: {checkOut}
🌙 {nights} nights, {guests} guests
💰 Total: RM{total}
✔️ Deposit: RM{deposit} (received)
💵 Balance on arrival: *RM{balance}*

See you soon!`,

    checkin:
`Hi {name}, here is your check-in info for {checkIn}:

📍 Address: {address}
🗺️ Map: {mapLink}
🕑 Check-in: after {checkInTime}
🕛 Check-out: before {checkOutTime}
💵 Balance of *RM{balance}* is paid on arrival (cash, DuitNow or bank transfer).

If you need anything, just WhatsApp us. Welcome!`,

    thanks:
`Hi {name}, thank you for staying with us! 🙏
We hope you enjoyed it. If you come to Kuching again, let us know 😊`
  }
};

// ---------- 4. Day and month names used in dates ----------
var DATE_WORDS = {
  ms: {
    days: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
    months: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"]
  },
  id: {
    days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  },
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
};
