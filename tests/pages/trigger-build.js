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
  configFormIsHidden: isHidden('[data-test-request-config-form]'),
  configFormIsVisible: isVisible('[data-test-request-config-form]'),
  configFormTriggerLinkIsHidden: isHidden('.option-dropdown .trigger-build-anchor'),
  configFormTriggerLinkIsPresent: isPresent('.option-dropdown .trigger-build-anchor'),
  showConfigForm: clickable('.option-dropdown .trigger-build-anchor'),
  requestConfigButtonsIsPresent: isPresent('data-test-request-configs-button'),

  selectBranch(branch) {
    selectChoose('[data-test-trigger-build-branch]', branch);
  },

  branches: collection('#trigger-build-branches option', {
    value: attribute('value')
  }),

  writeMessage: fillable('[data-test-trigger-build-message] input'),
  writeConfig: fillable('[data-test-trigger-build-config] textarea'),
  clickSubmit: clickable('[data-test-trigger-build-submit]'),

  writeConfigFormMessage: fillable('[data-test-request-config-form] input'),
  writeConfigFormConfig: fillable('[data-test-request-config-form] textarea'),
  clickConfigFormSubmit: clickable('[data-test-request-configs-trigger-build]'),
});
