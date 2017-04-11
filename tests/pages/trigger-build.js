import PageObject from 'travis/tests/page-object';

let {
  visitable,
  clickable,
  isHidden,
  isVisible,
  selectable,
  fillable
} = PageObject;

export default PageObject.create({
  visit: visitable(':slug'),
  popupIsHidden: isHidden('.trigger-build-modal'),
  popupTriggerLinkIsHidden: isHidden('.option-dropdown .trigger-build-anchor'),
  openPopup: clickable('.option-dropdown .trigger-build-anchor'),
  popupIsVisible: isVisible('.trigger-build-modal'),
  selectBranch: selectable('#trigger-build-branches'),
  writeMessage: fillable('#trigger-build-message'),
  writeConfig: fillable('#trigger-build-config'),
  clickSubmit: clickable('.trigger-build-submit')
});
