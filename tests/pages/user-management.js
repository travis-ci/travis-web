import {
  create,
  clickable,
  hasClass,
  isVisible,
  text
} from 'ember-cli-page-object';

export default create({
  visit: clickable('[data-test-repo-settings-show-user-management-modal]'),

  username: {
    scope: '[data-test-permission-username]',
    text: text(),
  },

  role: {
    scope: '[data-test-permission-role]',
    text: text(),
  },

  toggler: {
    scope: '[data-test-permission-active]',
    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  }
});
