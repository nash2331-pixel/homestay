// Saving in the browser, shared by the owner page and the helper page.
// localStorage keeps data on this phone only, even after closing Safari.
// It is not shared between phones yet. try/catch keeps the page working
// if the browser blocks storage (for example in Private mode).

function load(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Nothing we can do; the change stays on screen until the page closes.
  }
}
