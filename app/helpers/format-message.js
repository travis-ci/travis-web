import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { get } from '@ember/object';

import EmojiConvertor from 'emoji-js';

import config from 'travis/config/environment';
import vcsLinks from 'travis/utils/vcs-links';

const emojiConvertor = new EmojiConvertor();
emojiConvertor.img_sets.apple.path = `${config.emojiPrepend}/images/emoji/`;
emojiConvertor.include_title = true;
emojiConvertor.allow_native = false;

function escape(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function handleMaxLength(message, maxLength) {
  return maxLength ? message.slice(0, maxLength) : message;
}

function handleShort(message, short) {
  return short ? message.split(/\n/)[0] : message;
}

function handlePre(message, pre) {
  return pre ? message.replace(/\n/g, '<br/>') : message;
}

function handleEventType(message, eventType) {
  if (eventType == 'cron') {
    return `<span class='message-label badge'>cron</span> ${message}`;
  }
  return message;
}

function handleRepo(message, repo) {
  // TODO: Figure out more permanent fix for teal #1885
  if (repo) {
    const owner = get(repo, 'owner');
    const login = typeof owner === 'object' ? owner.login : owner;
    const repoName = get(repo, 'name');
    const vcsType = get(repo, 'vcsType');

    return githubify(message, login, repoName, vcsType);
  }

  return message;
}

function formatMessage(message, options) {
  message = escape(message);
  message = handleMaxLength(message, options.maxLength);
  message = handleShort(message, options.short);
  message = handleRepo(message, options.repo);
  message = handlePre(message, options.pre);
  message = handleEventType(message, options.eventType);
  message = emojiConvertor.replace_colons(message);

  return message;
}

const refRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');
const userRegexp = new RegExp('\\B@([\\w-]+)', 'g');
const commitRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

function githubify(text, owner, repo, vcsType) {
  text = text.replace(refRegexp, (ref, matchedOwner, matchedRepo, matchedNumber) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber,
    };
    return _issueLink(ref, current, matched, vcsType);
  });

  text = text.replace(userRegexp, (reference, username) => _userLink(reference, username, vcsType));

  text = text.replace(commitRegexp, (reference, matchedOwner, matchedRepo, matchedSHA) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      sha: matchedSHA
    };
    return _commitLink(reference, current, matched, vcsType);
  });
  return text;
}

function _issueLink(reference, current, matched, vcsType) {
  const owner = matched.owner || current.owner;
  const repo = matched.repo || current.repo;
  const slug = `${owner}/${repo}`;
  const issueNumber = matched.number;
  const href = vcsLinks.issueUrl(vcsType, slug, issueNumber);

  return `<a href="${href}">${reference}</a>`;
}

function _userLink(reference, username, vcsType) {
  const href = vcsLinks.profileUrl(vcsType, username);
  return `<a href="${href}">${reference}</a>`;
}

function _commitLink(reference, current, matched, vcsType) {
  const owner = matched.owner || current.owner;
  const repo = matched.repo || current.repo;
  const slug = `${owner}/${repo}`;
  const commitSha = matched.sha;
  const href = vcsLinks.commitUrl(vcsType, slug, commitSha);

  return `<a href="${href}">${reference}</a>`;
}

export default helper((params, options) => {
  const message = params[0] || '';
  const formattedMessage = formatMessage(message, options);

  return new htmlSafe(formattedMessage);
});
