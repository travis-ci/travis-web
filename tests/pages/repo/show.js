import {
  create,
  clickable,
  attribute,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo'),
  openStatusImagePopup: clickable('#status-image-popup'),
  statusBadgeImageSrc: attribute('src', '#status-image-popup img'),

  owner: text('[data-test-repo-header-title] a:first-of-type'),
  name: text('[data-test-repo-header-title] a:last-of-type'),
  gitHubLink: {
    scope: '.repo-gh',
    href: attribute('href'),
    title: attribute('title')
  },
});
