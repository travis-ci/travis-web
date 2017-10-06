/* global EmojiConvertor */
import { helper } from '@ember/component/helper';

import { htmlSafe } from '@ember/string';
import { get } from '@ember/object';
import config from 'travis/config/environment';

const emojiConvertor = new EmojiConvertor();

emojiConvertor.img_sets.apple.path = `${config.emojiPrepend}/images/emoji/`;
emojiConvertor.include_title = true;

function formatMessage(message, options) {
  message = message || '';
  if (options.short) {
    message = message.split(/\n/)[0];
  }
  message = emojiConvertor.replace_colons(_escape(message));

  // TODO: Figure out more permanent fix for teal #1885
  if (options.repo) {
    let owner = get(options.repo, 'owner');
    if (typeof owner === 'object') {
      owner = owner.login;
    }
    message = githubify(message, owner, get(options.repo, 'name'));
  }
  if (options.pre) {
    message = message.replace(/\n/g, '<br/>');
  }
  if (options.eventType && options.eventType == 'cron') {
    message = htmlSafe(`<span class='message-label badge'>cron</span> ${message}`);
  }
  return message;
}

const refRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');
const userRegexp = new RegExp('\\B@([\\w-]+)', 'g');
const commitRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

function githubify(text, owner, repo) {
  text = text.replace(refRegexp, (ref, matchedOwner, matchedRepo, matchedNumber) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber,
    };
    return _githubReferenceLink(ref, current, matched);
  });

  text = text.replace(userRegexp, (reference, username) => _githubUserLink(reference, username));

  text = text.replace(commitRegexp, (reference, matchedOwner, matchedRepo, matchedSHA) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      sha: matchedSHA
    };
    return _githubCommitReferenceLink(reference, current, matched);
  });
  return text;
}

function _githubReferenceLink(reference, current, matched) {
  let owner, repo;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;

  const href = `${config.sourceEndpoint}/${owner}/${repo}/issues/${matched.number}`;
  return `<a href="${href}">${reference}</a>`;
}

function _githubUserLink(reference, username) {
  return `<a href="${config.sourceEndpoint}/${username}">${reference}</a>`;
}

function _githubCommitReferenceLink(reference, current, matched) {
  let owner, repo, url;
  owner = matched.owner || current.owner;
  repo = matched.repo || current.repo;
  let slug = `${owner}/${repo}`;
  // TODO: this duplicated the implementation of the githubCommit method
  // in the urls service, but I didn't want to try and rewrite this entire file
  url = `${config.sourceEndpoint}/${slug}/commit/${matched.sha}`;
  return `<a href="${url}">${reference}</a>`;
}

function _escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


export default helper((params, hash) => {
  const [message] = params;
  const formatted = formatMessage(message, hash);
  return new htmlSafe(formatted);
});
