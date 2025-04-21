import {
  create,
  attribute,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo'),

  statusBadge: {
    scope: '[data-test-status-image-popup]',
    src: attribute('src', 'img'),
    title: attribute('title'),
  },

  flash: text('[data-test-flash-message-text]'),
  customFlash: text('[data-test-custom-flash-message-text]'),
  owner: text('[data-test-repo-header-title] a:first-of-type'),
  name: text('[data-test-repo-header-title] a:last-of-type'),
  gitHubLink: {
    scope: '.repo-gh',
    href: attribute('href'),
    title: attribute('title'),
  },
});
