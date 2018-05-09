if (isUnsupportedBrowser()) {
  window.location.href = '/unsupported-browser.html';
}

function isUnsupportedBrowser() {
  parser = new UAParser();

  if (parser.getBrowser().name === 'IE') {
    return true;
  } else {
    return false;
  }
}
