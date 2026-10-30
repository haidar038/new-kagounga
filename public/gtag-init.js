// Google tag (gtag.js) bootstrap. Kept out of index.html so a strict CSP
// needs no inline-script hash and the parser is never blocked. Commands queue
// in dataLayer; the gtag.js bundle loads only after analytics consent, then
// after first paint.
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-8JC93J3FD7", { send_page_view: false });

(function () {
  var KEY = "kga-consent-v1";
  var injected = false;
  var inject = function () {
    if (injected) return;
    injected = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-8JC93J3FD7";
    document.head.appendChild(s);
  };
  var queue = function () {
    (window.requestIdleCallback || function (cb) { setTimeout(cb, 1); })(inject, {
      timeout: 3000,
    });
  };
  var granted = false;
  try {
    granted = localStorage.getItem(KEY) === "granted";
  } catch {}
  if (granted) {
    if (document.readyState === "complete") queue();
    else window.addEventListener("load", queue);
  } else {
    window.addEventListener("kga-consent", function (e) {
      if (e.detail === "granted") queue();
    });
  }
})();
