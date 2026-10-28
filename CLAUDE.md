# Homestay Booking Tracker

Booking tracker for a family homestay in Kuching, Malaysia.

## Who uses the app

- **Owner** (mom): uses an iPhone and is not very techy.
- **On-site helper**: the same person is also the cleaner.
- **Guests NEVER use the app.** They talk to the owner on WhatsApp.

## Business rules

### Pricing
- 1 night = **RM300**.
- 2 or more nights = **RM250 for EVERY night** (not just the extra nights).

Examples:
| Nights | Total |
|--------|-------|
| 1 | RM300 |
| 2 | RM500 (2 × 250) |
| 3 | RM750 (3 × 250) |

### Deposit and balance
- Deposit = **RM150**.
- Balance on arrival = total − deposit.
  - Example: 3 nights → RM750 − RM150 = **RM600** balance on arrival.

### Cleaning
- Cleaning cost = **RM70 per checkout**.

### Payments
- Payment methods: **cash**, **DuitNow**, **bank transfer**.
- Cash is often received by the helper, who later transfers it to the owner.
  The app should make it easy to see which cash is still with the helper.
- **No payment gateway.** The app only RECORDS payments; it never takes money.
- Each payment records: amount, method, received by (owner or helper), date,
  and, if the helper received it, whether it has been transferred to the owner.

### Dashboard rules
- **Still to collect** = total − payments so far, for every booking (never below 0).
- **Money with helper** = payments received by the helper and not yet transferred
  (any method, not only cash).
- **Unpaid cleaning** = RM70 for each booking that has checked out (checkout
  today counts) and whose cleaning is not marked paid.
- **This month's profit** = payments dated this month − RM70 for each checkout
  this month (counted whether or not the cleaner has been paid yet).

## Data and security

- Data lives in a **Google Sheet** (tabs: Bookings, Payments), reached only through
  a **Google Apps Script** web app (`apps-script/Code.js`). Pages never store bookings locally.
- Two PINs, stored in Script Properties (`OWNER_PIN`, `HELPER_PIN`), never in code.
  The **server** checks the PIN and the role on every request:
  - owner: everything
  - helper: only today's check-ins/check-outs; record cash (server computes the amount);
    tick cleaning on check-out day. The helper is never sent other days' bookings or totals.
- Deployment steps for the user are in `DEPLOY.md`. Walk the user through them one at a time.

## Language

- App language: **Bahasa Melayu by default**, with an English toggle.
- Use simple everyday wording. No formal BM.
- WhatsApp message templates in 3 languages:
  - Bahasa Melayu
  - Bahasa Indonesia
  - English

## Design

- Mobile-first, built for **iPhone Safari**.
- Big buttons, minimal typing (prefer taps, pickers and presets over text fields).

## How to work with me

- Keep code simple.
- Explain choices in plain language, because I am a beginner.
