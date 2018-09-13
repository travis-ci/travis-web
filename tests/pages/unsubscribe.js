import {
  create,
  clickable,
  isPresent,
  text,
  visitable,
  hasClass
} from 'ember-cli-page-object';

import {
  EMAIL_UNSUBSCRIBE,
  EMAIL_UNSUBSCRIBE_SADMAIL,
  EMAIL_UNSUBSCRIBE_TITLE,
  EMAIL_UNSUBSCRIBE_DESCRIPTION,
  EMAIL_UNSUBSCRIBE_PRIMARY_BUTTON,
  EMAIL_UNSUBSCRIBE_SECONDARY_BUTTON,
  EMAIL_UNSUBSCRIBE_APPENDIX
} from 'travis/tests/helpers/selectors';

export default create({
  visit: visitable('account/preferences/unsubscribe'),

  emailUnsubscribe: {
    scope: EMAIL_UNSUBSCRIBE,

    sadmail: {
      scope: EMAIL_UNSUBSCRIBE_SADMAIL,
      isPresent: isPresent()
    },

    title: {
      scope: EMAIL_UNSUBSCRIBE_TITLE,
      text: text(),
      isPresent: isPresent()
    },

    description: {
      scope: EMAIL_UNSUBSCRIBE_DESCRIPTION,
      text: text(),
      isPresent: isPresent()
    },

    primaryButton: {
      scope: EMAIL_UNSUBSCRIBE_PRIMARY_BUTTON,
      click: clickable(),
      title: text(),
      isPresent: isPresent(),
      isUnsubscribe: hasClass('button--orange'),
      isResubscribe: hasClass('button--white')
    },

    secondaryButton: {
      scope: EMAIL_UNSUBSCRIBE_SECONDARY_BUTTON,
      click: clickable(),
      title: text(),
      isPresent: isPresent()
    },

    appendix: {
      scope: EMAIL_UNSUBSCRIBE_APPENDIX,
      text: text(),
      isPresent: isPresent()
    }
  }
});
