import {
  create,
  clickable,
  fillable,
  isPresent,
  text,
  visitable
} from 'ember-cli-page-object';

import {
  HELP_PAGE_GREETING_SECTION,
  HELP_PAGE_GREETING_HEADER,
  HELP_PAGE_GREETING_USERNAME,
  HELP_PAGE_NAVIGATION_LINKS,
  HELP_PAGE_STATUS,
  HELP_PAGE_SUPPORT_SECTION,
  ZENDESK_FORM_HEADER,
  ZENDESK_FORM_SUPPORT_HOURS,
  ZENDESK_FORM_CONTAINER,
  ZENDESK_FORM_EMAIL,
  ZENDESK_FORM_SUBJECT,
  ZENDESK_FORM_DESCRIPTION,
  ZENDESK_FORM_SUBMIT,
  ZENDESK_FORM_LOG_IN_IMAGE,
  ZENDESK_FORM_LOG_IN_BUTTON,
  ZENDESK_FORM_SUCCESS_HEADER,
  ZENDESK_FORM_SUCCESS_IMAGE,
  ZENDESK_FORM_SUCCESS_MESSAGE,
  ZENDESK_FORM_BACK_LINK
} from 'travis/tests/helpers/selectors';

export default create({
  visit: visitable('help'),

  greetingSection: {
    scope: HELP_PAGE_GREETING_SECTION,
    isPresent: isPresent(),

    header: {
      scope: HELP_PAGE_GREETING_HEADER,
      text: text()
    },

    username: {
      scope: HELP_PAGE_GREETING_USERNAME,
      isPresent: isPresent(),
      text: text()
    },

    navigationLinks: {
      scope: HELP_PAGE_NAVIGATION_LINKS,
      isPresent: isPresent()
    },

    status: {
      scope: HELP_PAGE_STATUS,
      isPresent: isPresent()
    }
  },

  supportSection: {
    scope: HELP_PAGE_SUPPORT_SECTION,
    isPresent: isPresent(),

    header: {
      scope: ZENDESK_FORM_HEADER,
      isPresent: isPresent()
    },

    hours: {
      scope: ZENDESK_FORM_SUPPORT_HOURS,
      isPresent: isPresent(),
      text: text()
    },

    form: {
      scope: ZENDESK_FORM_CONTAINER,
      isPresent: isPresent(),

      email: {
        scope: ZENDESK_FORM_EMAIL,
        isPresent: isPresent(),
        fill: fillable()
      },

      subject: {
        scope: ZENDESK_FORM_SUBJECT,
        isPresent: isPresent(),
        fill: fillable('input')
      },

      description: {
        scope: ZENDESK_FORM_DESCRIPTION,
        isPresent: isPresent(),
        fill: fillable('textarea')
      },

      submit: {
        scope: ZENDESK_FORM_SUBMIT,
        isPresent: isPresent(),
        click: clickable()
      }
    },

    logInImage: {
      scope: ZENDESK_FORM_LOG_IN_IMAGE,
      isPresent: isPresent()
    },

    logInButton: {
      scope: ZENDESK_FORM_LOG_IN_BUTTON,
      isPresent: isPresent()
    },

    successHeader: {
      scope: ZENDESK_FORM_SUCCESS_HEADER,
      isPresent: isPresent()
    },

    successImage: {
      scope: ZENDESK_FORM_SUCCESS_IMAGE,
      isPresent: isPresent()
    },

    successMessage: {
      scope: ZENDESK_FORM_SUCCESS_MESSAGE,
      isPresent: isPresent(),
      text: text()
    },

    backLink: {
      scope: ZENDESK_FORM_BACK_LINK,
      isPresent: isPresent(),
      click: clickable()
    }
  }
});
