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
  configFormIsHidden: isHidden('[data-test-build-config-form]'),
  configFormIsVisible: isVisible('[data-test-build-config-form]'),
  popupTriggerLinkIsHidden: isHidden('.option-dropdown [trigger-build-anchor]'),
  popupTriggerLinkIsPresent: isPresent('.option-dropdown [trigger-build-anchor]'),
  showConfigForm: clickable('.option-dropdown [trigger-build-anchor]'),
  requestConfigButtonsIsPresent: isPresent('data-test-request-configs-button'),

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
