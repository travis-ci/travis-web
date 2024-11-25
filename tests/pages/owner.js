import {
  attribute,
  create,
  collection,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/:username' + '?tab=repositories'),

  avatar: {
    scope: '.avatar',
    src: attribute('src', 'img'),
  },

  title: text('.owner-title'),
  login: {
    scope: '.owner-handle',
    text: text('.label-align'),
    title: attribute('title', 'a'),
    href: attribute('href', 'a'),
  },

  repos: collection('.owner-tiles .owner-tile', {
    name: text('.repo-title span.repo-title-text'),
    buildNumber: text('.build-number .label-align'),
    defaultBranch: text('.default-branch .default-branch-name'),
    commitSha: text('.commit-sha .commit-compare'),
    commitDate: text('.owner-tile-date .finished-at'),

    noBuildMessage: text('p.row-content')
  })
});
