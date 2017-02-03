/* global Travis, EmojiConvertor */
import configKeysMap from 'travis/utils/keys-map';
import config from 'travis/config/environment';
import Ember from 'ember';

const emojiConvertor = new EmojiConvertor();

emojiConvertor.img_sets.apple.path = `${config.emojiPrepend}/images/emoji/`;
emojiConvertor.include_title = true;

var _escape, _githubCommitReferenceLink, _githubCommitReferenceRegexp,
  _githubReferenceLink, _githubReferenceRegexp, _githubUserLink, _githubUserRegexp,
  _normalizeDateString, _nowUtc, _toUtc, colorForState, colors, compact, configKeys,
  durationFrom, formatMessage, githubify,
  intersect, timeAgoInWords, timeago;

timeago = Ember.$.timeago;
timeago.settings.allowFuture = true;

colors = {
  'default': 'yellow',
  passed: 'green',
  failed: 'red',
  errored: 'red',
  canceled: 'gray'
};

intersect = function (array, other) {
  return array.filter(function (element) {
    return other.indexOf(element) !== -1;
  });
};

compact = function (object) {
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

colorForState = function (state) {
  return colors[state] || colors['default'];
};

formatMessage = function (message, options) {
  message = message || '';
  if (options.short) {
    message = message.split(/\n/)[0];
  }
  message = emojiConvertor.replace_colons(_escape(message));
  if (options.repo) {
    message = githubify(message, Ember.get(options.repo, 'owner'), Ember.get(options.repo, 'name'));
  }
  if (options.pre) {
    message = message.replace(/\n/g, '<br/>');
  }
  return message;
};

timeAgoInWords = function (date) {
  if (date) {
    return timeago(date);
  }
};

durationFrom = function (started, finished) {
  started = started && _toUtc(new Date(_normalizeDateString(started)));
  finished = finished ? _toUtc(new Date(_normalizeDateString(finished))) : _nowUtc();
  if (started && finished) {
    return Math.round((finished - started) / 1000);
  } else {
    return 0;
  }
};

githubify = function (text, owner, repo) {
  text = text.replace(_githubReferenceRegexp, function (reference, matchedOwner, matchedRepo, matchedNumber) {
    return _githubReferenceLink(reference, {
      owner: owner,
      repo: repo
    }, {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber
    });
  });
  text = text.replace(_githubUserRegexp, function (reference, username) {
    return _githubUserLink(reference, username);
  });
  text = text.replace(_githubCommitReferenceRegexp, function (reference, matchedOwner, matchedRepo, matchedSHA) {
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

_githubReferenceRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');

_githubReferenceLink = function (reference, current, matched) {
  var owner, repo;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  return '<a href="' + config.sourceEndpoint + '/' + owner + '/' + repo + '/issues/' + matched.number + '">' + reference + '</a>';
};

_githubUserRegexp = new RegExp('\\B@([\\w-]+)', 'g');

_githubUserLink = function (reference, username) {
  return '<a href="' + config.sourceEndpoint + '/' + username + '">' + reference + '</a>';
};

_githubCommitReferenceRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

_githubCommitReferenceLink = function (reference, current, matched) {
  var owner, repo, url;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  let slug = `${owner}/${repo}`;
  // TODO: this duplicated the implementation of the githubCommit method
  // in the urls service, but I didn't want to try and rewrite this entire file
  url = `${config.sourceEndpoint}/${slug}/commit/${matched.sha}`;
  return '<a href="' + url + '">' + reference + '</a>';
};

_normalizeDateString = function (string) {
  if (window.JHW) {
    string = string.replace('T', ' ').replace(/-/g, '/');
    string = string.replace('Z', '').replace(/\..*$/, '');
  }
  return string;
};

_nowUtc = function () {
  // TODO: we overwrite Travis.currentDate in tests, so we need to leave this
  // global usage as it is for now, but it should be removed at some point
  return _toUtc(Travis.currentDate());
};

_toUtc = function (date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

_escape = function (text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

configKeys = function (config) {
  if (!config) {
    return [];
  }
  return intersect(Object.keys(config), Object.keys(configKeysMap));
};

export {
  configKeys, githubify, durationFrom, timeAgoInWords, formatMessage,
  colorForState, compact
};
