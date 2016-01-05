import emojiDictionary from 'travis/utils/emoji-dictionary';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import configKeysMap from 'travis/utils/keys-map';
import config from 'travis/config/environment';
import Ember from 'ember';

var _emojize, _escape, _githubCommitReferenceLink, _githubCommitReferenceRegexp,
    _githubReferenceLink, _githubReferenceRegexp, _githubUserLink, _githubUserRegexp,
    _normalizeDateString, _nowUtc, _toUtc, colorForState, colors, compact, configKeys,
    durationFrom, formatCommit, formatConfig, formatMessage, formatSha, githubify,
    intersect, mapObject, only, pathFrom, safe, timeAgoInWords, timeInWords, timeago;

timeago = $.timeago;

mapObject = $.map;

colors = {
  "default": 'yellow',
  passed: 'green',
  failed: 'red',
  errored: 'red',
  canceled: 'gray'
};

mapObject = function(elems, callback, arg) {
  var i, key, ret, value;
  value = void 0;
  key = void 0;
  ret = [];
  i = 0;
  for (key in elems) {
    value = callback(elems[key], key, arg);
    if (value != null) {
      ret[ret.length] = value;
    }
  }
  return ret.concat.apply([], ret);
};

only = function(object) {
  var key, keys, result;
  keys = Array.prototype.slice.apply(arguments);
  object = (typeof keys[0] === 'object' ? keys.shift() : this);
  result = {};
  for (key in object) {
    if (keys.indexOf(key) !== -1) {
      result[key] = object[key];
    }
  }
  return result;
};

intersect = function(array, other) {
  return array.filter(function(element) {
    return other.indexOf(element) !== -1;
  });
};

compact = function(object) {
  var key, ref, result, value;
  result = {};
  ref = object || {};
  for (key in ref) {
    value = ref[key];
    if (!Ember.isEmpty(value)) {
      result[key] = value;
    }
  }
  return result;
};

safe = function(string) {
  return new Ember.Handlebars.SafeString(string);
};

colorForState = function(state) {
  return colors[state] || colors['default'];
};

formatCommit = function(sha, branch) {
  return formatSha(sha) + (branch ? " (" + branch + ")" : '');
};

formatSha = function(sha) {
  return (sha || '').substr(0, 7);
};

formatConfig = function(config) {
  var values;
  config = only(config, Object.keys(configKeysMap));
  values = mapObject(config, function(value, key) {
    value = (value && value.join ? value.join(', ') : value) || '';
    if (key === 'rvm' && ("" + value).match(/^\d+$/)) {
      value = value + ".0";
    }
    return '%@: %@'.fmt(configKeysMap[key], value);
  });
  if (values.length === 0) {
    return '-';
  } else {
    return values.join(', ');
  }
};

formatMessage = function(message, options) {
  message = message || '';
  if (options.short) {
    message = message.split(/\n/)[0];
  }
  message = _emojize(_escape(message));
  if (options.repo) {
    message = githubify(message, Ember.get(options.repo, 'owner'), Ember.get(options.repo, 'name'));
  }
  if (options.pre) {
    message = message.replace(/\n/g, '<br/>');
  }
  return message;
};

timeAgoInWords = function(date) {
  if (date) {
    return timeago(date);
  }
};

durationFrom = function(started, finished) {
  started = started && _toUtc(new Date(_normalizeDateString(started)));
  finished = finished ? _toUtc(new Date(_normalizeDateString(finished))) : _nowUtc();
  if (started && finished) {
    return Math.round((finished - started) / 1000);
  } else {
    return 0;
  }
};

timeInWords = function(duration) {
  var days, hours, minutes, result, seconds;
  days = Math.floor(duration / 86400);
  hours = Math.floor(duration % 86400 / 3600);
  minutes = Math.floor(duration % 3600 / 60);
  seconds = duration % 60;
  if (days > 0) {
    return 'more than 24 hrs';
  } else {
    result = [];
    if (hours === 1) {
      result.push(hours + ' hr');
    }
    if (hours > 1) {
      result.push(hours + ' hrs');
    }
    if (minutes > 0) {
      result.push(minutes + ' min');
    }
    if (seconds > 0) {
      result.push(seconds + ' sec');
    }
    if (result.length > 0) {
      return result.join(' ');
    } else {
      return '-';
    }
  }
};

githubify = function(text, owner, repo) {
  text = text.replace(_githubReferenceRegexp, function(reference, matchedOwner, matchedRepo, matchedNumber) {
    return _githubReferenceLink(reference, {
      owner: owner,
      repo: repo
    }, {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber
    });
  });
  text = text.replace(_githubUserRegexp, function(reference, username) {
    return _githubUserLink(reference, username);
  });
  text = text.replace(_githubCommitReferenceRegexp, function(reference, matchedOwner, matchedRepo, matchedSHA) {
    return _githubCommitReferenceLink(reference, {
      owner: owner,
      repo: repo
    }, {
      owner: matchedOwner,
      repo: matchedRepo,
      sha: matchedSHA
    });
  });
  return text;
};

_githubReferenceRegexp = new RegExp("([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)", 'g');

_githubReferenceLink = function(reference, current, matched) {
  var owner, repo;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  return "<a href=\"" + config.sourceEndpoint + "/" + owner + "/" + repo + "/issues/" + matched.number + "\">" + reference + "</a>";
};

_githubUserRegexp = new RegExp("\\B@([\\w-]+)", 'g');

_githubUserLink = function(reference, username) {
  return "<a href=\"" + config.sourceEndpoint + "/" + username + "\">" + reference + "</a>";
};

_githubCommitReferenceRegexp = new RegExp("([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)", 'g');

_githubCommitReferenceLink = function(reference, current, matched) {
  var owner, repo, url;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  url = "" + (githubCommitUrl(owner + "/" + repo, matched.sha));
  return "<a href=\"" + url + "\">" + reference + "</a>";
};

_normalizeDateString = function(string) {
  if (window.JHW) {
    string = string.replace('T', ' ').replace(/-/g, '/');
    string = string.replace('Z', '').replace(/\..*$/, '');
  }
  return string;
};

_nowUtc = function() {
  // TODO: we overwrite Travis.currentDate in tests, so we need to leave this
  // global usage as it is for now, but it should be removed at some point
  return _toUtc(Travis.currentDate());
};

_toUtc = function(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

_emojize = function(text) {
  var emojis;
  emojis = text.match(/:\S+?:/g);
  if (emojis !== null) {
    emojis.uniq().forEach(function(emoji, ix) {
      var image, strippedEmoji;
      strippedEmoji = emoji.substring(1, emoji.length - 1);
      if (emojiDictionary.indexOf(strippedEmoji) !== -1) {
        image = '<img class=\'emoji\' title=\'' + emoji + '\' alt=\'' + emoji + '\' src=\'' + '/images/emoji/' + strippedEmoji + '.png\'/>';
        return text = text.replace(new RegExp(emoji, 'g'), image);
      }
    });
  }
  return text;
};

_escape = function(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

configKeys = function(config) {
  if (!config) {
    return [];
  }
  return intersect(Object.keys(config), Object.keys(configKeysMap));
};

pathFrom = function(url) {
  return (url || '').split('/').pop();
};

export {
  configKeys, githubify, timeInWords, durationFrom, timeAgoInWords, formatMessage, formatConfig,
  formatSha, formatCommit, colorForState, safe, compact, pathFrom
};
