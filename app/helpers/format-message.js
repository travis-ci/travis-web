import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { get } from '@ember/object';

import EmojiConvertor from 'emoji-js';

import config from 'travis/config/environment';
import { vcsLinks } from 'travis/services/external-links';

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
  if (maxLength && message.length > maxLength) {
    return `${message.slice(0, maxLength)}…`;
  } else {
    return message;
  }
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

    message = includeProfileLink(message, vcsType);
    message = includeIssueLink(message, login, repoName, vcsType);
    message = includeCommitLink(message, login, repoName, vcsType);
    return message;
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

function includeIssueLink(text, owner, repo, vcsType) {
  const refRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');

  return text.replace(refRegexp, (ref, matchedOwner, matchedRepo, matchedNumber) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      number: matchedNumber,
    };
    return _issueLink(ref, current, matched, vcsType);
  });
}

function includeProfileLink(text, vcsType) {
  const userRegexp = new RegExp('\\B@([\\w-]+)', 'g');

  return text.replace(userRegexp, (reference, username) => {
    const href = vcsLinks.profileUrl(vcsType, { owner: username });
    return `<a href="${href}">${reference}</a>`;
  });
}

function includeCommitLink(text, owner, repo, vcsType) {
  const commitRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

  return text.replace(commitRegexp, (reference, matchedOwner, matchedRepo, matchedSHA) => {
    const current = { owner, repo };
    const matched = {
      owner: matchedOwner,
      repo: matchedRepo,
      sha: matchedSHA
    };
    return _commitLink(reference, current, matched, vcsType);
  });
}

function _issueLink(reference, current, matched, vcsType) {
  const owner = matched.owner || current.owner;
  const repo = matched.repo || current.repo;
  const issue = matched.number;
  const href = vcsLinks.issueUrl(vcsType, { owner, repo, issue });

  return `<a href="${href}">${reference}</a>`;
}

function _commitLink(reference, current, matched, vcsType) {
  const owner = matched.owner || current.owner;
  const repo = matched.repo || current.repo;
  const commit = matched.sha;
  const href = vcsLinks.commitUrl(vcsType, { owner, repo, commit });

  return `<a href="${href}">${reference}</a>`;
}

export default helper((params, options) => {
  const message = params[0] || '';
  const formattedMessage = formatMessage(message, options);

  return new htmlSafe(formattedMessage);
});
