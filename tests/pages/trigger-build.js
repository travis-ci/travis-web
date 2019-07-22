import {
  create,
  attribute,
  visitable,
  clickable,
  collection,
  isHidden,
  isVisible,
  fillable,
  isPresent
} from 'ember-cli-page-object';
import { selectChoose } from 'ember-power-select/test-support';

export default create({
  visit: visitable(':owner/:repo'),
  popupIsHidden: isHidden('.trigger-build-modal'),
  popupTriggerLinkIsHidden: isHidden('.option-dropdown .trigger-build-anchor'),
  popupTriggerLinkIsPresent: isPresent('.option-dropdown .trigger-build-anchor'),
  openPopup: clickable('.option-dropdown .trigger-build-anchor'),
  popupIsVisible: isVisible('.trigger-build-modal'),

  selectBranch(branch) {
    selectChoose('[data-test-trigger-build-branch]', branch);
  },

  branches: collection('#trigger-build-branches option', {
    value: attribute('value')
  }),

  writeMessage: fillable('[data-test-trigger-build-message] input'),
  writeConfig: fillable('[data-test-trigger-build-config] textarea'),
  clickSubmit: clickable('[data-test-trigger-build-submit]')
});
