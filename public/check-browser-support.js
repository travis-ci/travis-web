if (isUnsupportedBrowser()) {
  // FIXME this needs a different page, obvsy
  window.location.href = '/500.html';
}

function isUnsupportedBrowser() {
  parser = new UAParser();

  if (parser.getBrowser().name === 'IE') {
    return true;
  } else {
    return false;
  }
}
