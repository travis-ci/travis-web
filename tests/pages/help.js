import {
  attribute,
  create,
  clickable,
  collection,
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
  HELP_PAGE_RESOURCES_SECTION,
  HELP_PAGE_RESOURCES_IMAGE,
  HELP_PAGE_RESOURCES_HEADER,
  HELP_PAGE_RESOURCES_LIST,
  HELP_PAGE_RESOURCES_BUTTON,
  HELP_PAGE_TOPICS_SECTION,
  HELP_PAGE_TOPICS_IMAGE,
  HELP_PAGE_TOPICS_HEADER,
  HELP_PAGE_TOPICS_LIST,
  HELP_PAGE_TOPICS_BUTTON,
  HELP_PAGE_SUPPORT_SECTION,
  ZENDESK_FORM_HEADER,
  ZENDESK_FORM_SUPPORT_HOURS,
  ZENDESK_FORM_CONTAINER,
  ZENDESK_FORM_EMAIL,
  ZENDESK_FORM_SUBJECT,
  ZENDESK_FORM_DESCRIPTION,
  ZENDESK_FORM_SUBMIT,
  ZENDESK_FORM_LOG_IN_HEADER,
  ZENDESK_FORM_LOG_IN_IMAGE,
  ZENDESK_FORM_LOG_IN_BUTTON,
  ZENDESK_FORM_SUCCESS_HEADER,
  ZENDESK_FORM_SUCCESS_IMAGE,
  ZENDESK_FORM_SUCCESS_MESSAGE,
  ZENDESK_FORM_BACK_LINK,
  ZENDESK_FORM_COMMUNITY_HEADER,
  ZENDESK_FORM_COMMUNITY_IMAGE,
  EPS_TRIGGER
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

  resourceSection: {
    scope: HELP_PAGE_RESOURCES_SECTION,
    isPresent: isPresent(),

    image: {
      scope: HELP_PAGE_RESOURCES_IMAGE,
      isPresent: isPresent()
    },

    header: {
      scope: HELP_PAGE_RESOURCES_HEADER,
      isPresent: isPresent(),
      text: text()
    },

    list: {
      scope: HELP_PAGE_RESOURCES_LIST,
      isPresent: isPresent(),
      items: collection('li', {
        isPresent: isPresent(),
        text: text(),
        href: attribute('href')
      })
    },

    button: {
      scope: HELP_PAGE_RESOURCES_BUTTON,
      isPresent: isPresent(),
      text: text(),
      href: attribute('href')
    }
  },

  topicSection: {
    scope: HELP_PAGE_TOPICS_SECTION,
    isPresent: isPresent(),

    image: {
      scope: HELP_PAGE_TOPICS_IMAGE,
      isPresent: isPresent()
    },

    header: {
      scope: HELP_PAGE_TOPICS_HEADER,
      isPresent: isPresent(),
      text: text()
    },

    list: {
      scope: HELP_PAGE_TOPICS_LIST,
      isPresent: isPresent(),
      items: collection('li', {
        isPresent: isPresent(),
        text: text(),
        href: attribute('href')
      })
    },

    button: {
      scope: HELP_PAGE_TOPICS_BUTTON,
      isPresent: isPresent(),
      text: text(),
      href: attribute('href')
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
        trigger: {
          scope: EPS_TRIGGER
        }
      },

      subject: {
        scope: ZENDESK_FORM_SUBJECT,
        isPresent: isPresent(),
        fill: fillable('input')
      },

      description: {
        scope: ZENDESK_FORM_DESCRIPTION,
        isPresent: isPresent(),
        fill: fillable()
      },

      submit: {
        scope: ZENDESK_FORM_SUBMIT,
        isPresent: isPresent(),
        click: clickable()
      }
    },

    logInHeader: {
      scope: ZENDESK_FORM_LOG_IN_HEADER,
      isPresent: isPresent()
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
    },

    communityHeader: {
      scope: ZENDESK_FORM_COMMUNITY_HEADER,
      isPresent: isPresent()
    },

    communityImage: {
      scope: ZENDESK_FORM_COMMUNITY_IMAGE,
      isPresent: isPresent()
    }
  }
});
