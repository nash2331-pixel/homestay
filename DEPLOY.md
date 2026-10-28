# Putting the app online with Google Sheets

This guide has every step in one place. Do them **in order**, one at a time.
You need about 30 minutes and a computer (not a phone) for steps 1–9.

**How it fits together:**
- The **Google Sheet** is where all bookings and payments are kept. It is also your backup:
  you can open it any time and read everything.
- The **Apps Script** is a small program attached to the Sheet. The pages talk to it,
  never to the Sheet directly. It checks the PIN on every request.
- The **pages** (`index.html` for the owner, `helper.html` for the helper) are what you see on the phone.

---

## Step 1: Make the Google Sheet

1. On a computer, go to **sheets.google.com**.
2. Make sure you are signed in with the Google account that should **own the data**
   (probably your mom's, or a family account). Whoever owns this Sheet owns all the bookings.
3. Click **Blank spreadsheet** (the big +).
4. Click "Untitled spreadsheet" at the top left and rename it **Homestay Bookings**.

Leave it empty. The program will create the tabs itself in step 5.

## Step 2: Open Apps Script

1. In the Sheet, click the menu **Extensions → Apps Script**. A new tab opens: this is
   where the program lives. It is attached to this Sheet only.
2. Click "Untitled project" at the top and rename it **Homestay server**.

## Step 3: Paste the server code

1. On the left you will see a file called **Code.gs** with a few lines in it.
   Click inside it, select everything (**Ctrl+A**) and delete it.
2. On your computer, open the file `apps-script/Code.js` from this project folder
   (Notepad is fine). Select everything (**Ctrl+A**), copy (**Ctrl+C**).
3. Paste it into Code.gs (**Ctrl+V**).
4. Save with **Ctrl+S** (or the floppy disk icon).

## Step 4: Choose the two PINs

The PINs are kept in Google's settings, **not** in any file, so nobody can read them from the page.

1. On the left edge, click the **gear icon (Project Settings)**.
2. Scroll down to **Script Properties** and click **Add script property**.
3. Property: `OWNER_PIN`, Value: a 6-digit number for your mom.
4. Click **Add script property** again.
   Property: `HELPER_PIN`, Value: a **different** 6-digit number for the helper.
5. Click **Add script property** once more for the bank details used in the
   "Minta deposit" WhatsApp message.
   Property: `PAYMENT_DETAILS`, Value: your bank details on **one line**, with `|`
   where a new line should start, for example:
   `Bank: Maybank | No. akaun: 1234567890 | Nama: Siti binti Ali | DuitNow: 012-345 6789`
   These stay with Google and are only given to the owner page after the owner PIN,
   so they are never on the public website or GitHub.
6. Click **Save script properties**.

Tips: use 6 digits, not 4. Avoid birthdays, 123456 or 000000. Write them down somewhere safe.
To change a PIN later, just change it here. Nothing else needs updating, but the person
will need to type the new PIN once.

## Step 5: Run the setup once (and give permission)

1. On the left edge, click the **< > icon (Editor)** to go back to the code.
2. At the top there is a drop-down next to "Debug". Choose **setup**.
3. Click **Run**.
4. Google asks for permission because the program wants to edit your Sheet:
   - Click **Review permissions** and pick the same Google account.
   - You will see **"Google hasn't verified this app"**. This is normal: the "app" is
     your own script, and only you have it. Click **Advanced**, then
     **Go to Homestay server (unsafe)**.
   - Click **Allow**.
5. At the bottom, the log should say **"All good: tabs are ready and both PINs are set."**
6. Go back to the Sheet tab: you should now see two tabs at the bottom, **Bookings** and **Payments**.
   You can delete the empty "Sheet1" tab.

If the log says the PINs are not set or are the same, fix step 4 and run setup again.
If it says the bank details are not set, add `PAYMENT_DETAILS` (step 4); everything
else still works without it.

## Step 6: Publish the server (deploy)

1. In Apps Script, click the blue **Deploy** button (top right) → **New deployment**.
2. Next to "Select type", click the **gear** → **Web app**.
3. Fill in:
   - Description: `v1`
   - Execute as: **Me**. The program uses your permission to edit the Sheet.
   - Who has access: **Anyone**. The phones can reach it without logging in
     to Google. This is safe because every request still needs a correct PIN, and
     the helper PIN can only do helper things.
4. Click **Deploy**.
5. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy.../exec`.

## Step 7: Check the server is online

Paste that URL into a new browser tab. You should see:
**Homestay server is running.**

## Step 8: Tell the pages where the server is

1. Open `config.js` in this project folder (Notepad is fine).
2. Replace `PASTE_WEB_APP_URL_HERE` with your URL, keeping the quotes:
   ```
   var SERVER_URL = "https://script.google.com/macros/s/AKfy.../exec";
   ```
3. Save.

## Step 9: Try it on the computer

1. Double-click `index.html`. It opens in your browser and asks for a PIN.
2. Type the **owner** PIN. You should see the app.
3. Add a test booking. Go to the Google Sheet: a new row appears in **Bookings**.
4. Open `helper.html`, type the **helper** PIN. If your test booking checks in today,
   you will see it there.
5. Delete the test booking in the owner page. The row disappears from the Sheet.

## Step 10: Put the pages on the phones

The pages need a web address so the iPhones can open them.
We will choose how to do this together when you get here.

---

## Later: changing the server code

If `apps-script/Code.js` changes, paste the new code (step 3), then:
**Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**
The URL stays the same, so `config.js` doesn't change.
(If you skip this, the old code keeps running.)

## Good to know

- **Backup:** the Sheet *is* the data. Google keeps its history:
  **File → Version history** in the Sheet lets you go back if something goes wrong.
- **Don't edit the Sheet by hand** while learning. Changing column names or order will
  confuse the program. Reading it is always fine.
- **Too many wrong PINs** (10 within 15 minutes) blocks everyone for 15 minutes. This
  stops someone guessing PINs. If it ever happens to you, just wait.
