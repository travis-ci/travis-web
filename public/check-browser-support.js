
/*!
 * Browser Support Check
 * Uses UAParser.js v1.0.40 to detect unsupported browsers
 * Redirects Internet Explorer < 11 to unsupported browser page
 */

// Load UAParser library dynamically
(function() {
  var script = document.createElement('script');
  script.src = 'ua-parser.min.js';
  script.onload = function() {
    // Run browser check after UAParser is loaded
    if (isUnsupportedBrowser()) {
      window.location.href = '/unsupported-browser.html';
    }
  };
  script.onerror = function() {
    // Fallback: if ua-parser fails to load, don't block the user
    console.warn('UAParser library failed to load, browser check disabled');
  };
  document.head.appendChild(script);
})();

function isUnsupportedBrowser() {
  // Check if UAParser is available
  if (typeof UAParser === 'undefined') {
    return false; // If UAParser isn't loaded yet, don't redirect
  }

  var browser = new UAParser().getBrowser();

  if (browser.name === 'IE' && parseInt(browser.version) < 11) {
    return true;
  } else {
    return false;
  }
}
