import {
  create,
  attribute,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo'),

  statusBadge: {
    scope: '#status-image-popup',
    src: attribute('src', 'img'),
    title: attribute('title'),
  },

  owner: text('[data-test-repo-header-title] a:first-of-type'),
  name: text('[data-test-repo-header-title] a:last-of-type'),
  gitHubLink: {
    scope: '.repo-gh',
    href: attribute('href'),
    title: attribute('title'),
  },
});
