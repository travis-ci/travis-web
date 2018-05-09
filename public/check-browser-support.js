if (isUnsupportedBrowser()) {
  // FIXME this needs a different page, obvsy
  window.location.href = '/500.html';
}

function isUnsupportedBrowser() {
  return true;
}
