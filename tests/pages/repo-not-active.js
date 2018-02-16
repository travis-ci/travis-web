import {
  create,
  clickable,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo'),
  notActiveHeadline: text('.missing-notice .page-title'),
  notActiveNotice: text('.missing-notice .page-notice'),
  activateButton: isVisible('.missing-notice button'),
  activate: clickable('.missing-notice button')
});
