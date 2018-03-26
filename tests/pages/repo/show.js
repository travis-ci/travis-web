import {
  create,
  clickable,
  attribute,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo'),
  openStatusImagePopup: clickable('#status-image-popup'),
  statusBadgeImageSrc: attribute('src', '#status-image-popup img')
});
