/* global EmojiConvertor */
import config from 'travis/config/environment';
import Ember from 'ember';

const emojiConvertor = new EmojiConvertor();

emojiConvertor.img_sets.apple.path = `${config.emojiPrepend}/images/emoji/`;
emojiConvertor.include_title = true;

function formatMessage(message, options) {
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
  if (options.eventType && options.eventType == 'cron') {
    message = `[cron] ${message}`;
  }
  return message;
}

const refRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');
const userRegexp = new RegExp('\\B@([\\w-]+)', 'g');
const commitRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

function githubify(text, owner, repo) {
  text = text.replace(refRegexp, function (ref, matchedOwner, matchedRepo, matchedNumber) {
    return _githubReferenceLink(ref, {
      owner: owner,
      repo: repo
    }, {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber
    });
  });
  text = text.replace(userRegexp, function (reference, username) {
    return _githubUserLink(reference, username);
  });
  text = text.replace(commitRegexp, function (reference, matchedOwner, matchedRepo, matchedSHA) {
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
}

function _githubReferenceLink(reference, current, matched) {
  var owner, repo;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;

  const href = `${config.sourceEndpoint}/${owner}/${repo}/issues/${matched.number}`;
  return `<a href="${href}">${reference}</a>`;
}

function _githubUserLink(reference, username) {
  return '<a href="' + config.sourceEndpoint + '/' + username + '">' + reference + '</a>';
}

function _githubCommitReferenceLink(reference, current, matched) {
  var owner, repo, url;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  let slug = `${owner}/${repo}`;
  // TODO: this duplicated the implementation of the githubCommit method
  // in the urls service, but I didn't want to try and rewrite this entire file
  url = `${config.sourceEndpoint}/${slug}/commit/${matched.sha}`;
  return '<a href="' + url + '">' + reference + '</a>';
}

function _escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


export default Ember.Helper.helper(function (params, hash) {
  return new Ember.String.htmlSafe(formatMessage(params[0], hash));
});
