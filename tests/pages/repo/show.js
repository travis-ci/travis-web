import PageObject from 'travis/tests/page-object';

let {
  clickable,
  attribute,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo'),
  openStatusImagePopup: clickable('#status-image-popup'),
  statusBadgeImageSrc: attribute('src', '#status-image-popup img')
});
