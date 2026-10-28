// Talks to the Google Apps Script server (address in config.js)
// and shows the PIN screen when needed. Used by both pages.
//
// Each page needs these elements: #pinScreen, #pinForm, #pinInput,
// #pinError, #app, #status. And a t() function with the err_... words.

// The PIN is remembered on this phone so it doesn't need typing every time.
// The server still checks it on every request.
function setupPin(start) {
  document.getElementById("pinForm").onsubmit = function (event) {
    event.preventDefault();
    var pin = document.getElementById("pinInput").value.trim();
    if (pin) save("pin", pin);
    if (load("pin", "")) start();
  };
  if (load("pin", "")) start();
  else showPinScreen("");
}

function showPinScreen(message) {
  document.getElementById("app").hidden = true;
  document.getElementById("pinScreen").hidden = false;
  document.getElementById("pinError").textContent = message;
  document.getElementById("pinInput").value = "";
}

function showApp() {
  document.getElementById("pinScreen").hidden = true;
  document.getElementById("app").hidden = false;
}

function logout() {
  save("pin", "");
  showPinScreen("");
}

// A promise that never finishes: used after a problem, so the page's
// .then(...) simply doesn't run.
function stopHere() {
  return new Promise(function () {});
}

// Send one request to the server. When it works, the page's .then(...) runs
// with the answer. When it doesn't, the problem is shown here.
function api(action, data) {
  if (SERVER_URL.indexOf("https://") !== 0) {
    showPinScreen(t("err_noServer"));
    return stopHere();
  }

  var status = document.getElementById("status");
  document.body.classList.add("busy"); // greys out buttons so nothing is tapped twice
  status.textContent = t("loading");

  return fetch(SERVER_URL, {
    method: "POST",
    // "text/plain" keeps this a simple request that Google accepts from any page.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ pin: load("pin", ""), action: action, data: data || {} })
  })
    .then(function (response) { return response.json(); })
    .catch(function () { return { ok: false, error: "network" }; })
    .then(function (result) {
      document.body.classList.remove("busy");
      status.textContent = "";

      if (result.ok) {
        showApp();
        return result;
      }
      if (result.error === "pin") {
        save("pin", "");
        showPinScreen(t("err_pin"));
      } else if (result.error === "notAllowed") {
        save("pin", "");
        showPinScreen(t("err_notAllowed"));
      } else if (result.error === "locked") {
        showPinScreen(t("err_locked"));
      } else if (result.error === "network") {
        if (document.getElementById("app").hidden) showPinScreen(t("err_network"));
        else alert(t("err_network"));
      } else {
        alert(t("err_server") + " " + (result.message || ""));
      }
      return stopHere();
    });
}
