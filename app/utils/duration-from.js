/* global Travis */
function _toUtc(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

function _nowUtc() {
  // TODO: we overwrite Travis.currentDate in tests, so we need to leave this
  // global usage as it is for now, but it should be removed at some point
  return _toUtc(Travis.currentDate());
}

function _normalizeDateString(string) {
  if (window.JHW) {
    string = string.replace('T', ' ').replace(/-/g, '/');
    string = string.replace('Z', '').replace(/\..*$/, '');
  }
  return string;
}

export default function durationFrom(started, finished) {
  started = started && _toUtc(new Date(_normalizeDateString(started)));
  finished = finished ? _toUtc(new Date(_normalizeDateString(finished))) : _nowUtc();
  if (started && finished) {
    return Math.round((finished - started) / 1000);
  } else {
    return 0;
  }
}
