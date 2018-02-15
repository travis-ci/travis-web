import PageObject from 'ember-cli-page-object';

let {
  attribute,
  visitable,
  clickable,
  collection,
  isHidden,
  isVisible,
  selectable,
  fillable
} = PageObject;

export default PageObject.create({
  visit: visitable(':owner/:repo'),
  popupIsHidden: isHidden('.trigger-build-modal'),
  popupTriggerLinkIsHidden: isHidden('.option-dropdown .trigger-build-anchor'),
  openPopup: clickable('.option-dropdown .trigger-build-anchor'),
  popupIsVisible: isVisible('.trigger-build-modal'),

  selectBranch: selectable('#trigger-build-branches'),
  branches: collection('#trigger-build-branches option', {
    value: attribute('value')
  }),

  writeMessage: fillable('#trigger-build-message'),
  writeConfig: fillable('#trigger-build-config'),
  clickSubmit: clickable('.trigger-build-submit')
});
