import PageObject from 'travis/tests/page-object';

let {
  clickable,
  isVisible,
  text,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo'),
  notActiveHeadline: text('.missing-notice .page-title'),
  notActiveNotice: text('.missing-notice .page-notice'),
  activateButton: isVisible('.missing-notice button'),
  activate: clickable('.missing-notice button')
});
