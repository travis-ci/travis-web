import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  isPresent,
  text,
  visitable
} from 'ember-cli-page-object';

import {
  PLANS_PAGE_HEADER_SECTION,
  PLANS_PAGE_HEADER_TITLE,
  PLANS_PAGE_HEADER_BODY,

  PLANS_PAGE_PRODUCT_SECTION,
  PLANS_PAGE_PRODUCT_SWITCH,
  PLANS_PAGE_PRODUCT_LIST,
  PLANS_PAGE_PRODUCT_BUTTON,

  PLANS_PAGE_OSS_SECTION,
  PLANS_PAGE_OSS_BUTTON,

  PLANS_PAGE_CONTACT_SECTION,
  SALES_CONTACT_FORM_CONTAINER,
  SALES_CONTACT_FORM_NAME,
  SALES_CONTACT_FORM_EMAIL,
  SALES_CONTACT_FORM_SIZE,
  SALES_CONTACT_FORM_PHONE,
  SALES_CONTACT_FORM_MESSAGE,
  SALES_CONTACT_FORM_SUBMIT,

  PLANS_PAGE_ENTERPRISE_SECTION,
  PLANS_PAGE_ENTERPRISE_BUTTON,

  PLANS_PAGE_FAQ_SECTION,
  PLANS_PAGE_FAQ_LIST,

  PLANS_PAGE_MESSAGE_SECTION,
  PLANS_PAGE_MESSAGE_BUTTON,

  PLANS_THANKS_PAGE_CONTAINER,
  PLANS_THANKS_PAGE_TITLE,
  PLANS_THANKS_PAGE_IMAGE,
  PLANS_THANKS_PAGE_BODY,
  PLANS_THANKS_PAGE_BUTTON,
} from 'travis/tests/helpers/selectors';

export default create({
  visit: visitable('/plans'),
  visitThanks: visitable('/plans/thank-you'),

  headerSection: {
    scope: PLANS_PAGE_HEADER_SECTION,
    isPresent: isPresent(),

    title: {
      scope: PLANS_PAGE_HEADER_TITLE,
      text: text()
    },

    body: {
      scope: PLANS_PAGE_HEADER_BODY,
      text: text()
    },
  },

  productSection: {
    scope: PLANS_PAGE_PRODUCT_SECTION,
    isPresent: isPresent(),

    intervalSwitch: {
      scope: PLANS_PAGE_PRODUCT_SWITCH,
      isPresent: isPresent(),
    },

    list: {
      scope: PLANS_PAGE_PRODUCT_LIST,
      isPresent: isPresent(),
      items: collection('.grid-item', {
        isPresent: isPresent(),
      })
    },

    button: {
      scope: PLANS_PAGE_PRODUCT_BUTTON,
      isPresent: isPresent(),
      text: text(),
    },
  },

  ossSection: {
    scope: PLANS_PAGE_OSS_SECTION,
    isPresent: isPresent(),

    button: {
      scope: PLANS_PAGE_OSS_BUTTON,
      isPresent: isPresent(),
      text: text(),
    },
  },

  contactSection: {
    scope: PLANS_PAGE_CONTACT_SECTION,
    isPresent: isPresent(),

    form: {
      scope: SALES_CONTACT_FORM_CONTAINER,
      isPresent: isPresent(),

      name: {
        scope: SALES_CONTACT_FORM_NAME,
        isPresent: isPresent(),
        fill: fillable(),
      },
      email: {
        scope: SALES_CONTACT_FORM_EMAIL,
        isPresent: isPresent(),
        fill: fillable(),
      },
      size: {
        scope: SALES_CONTACT_FORM_SIZE,
        isPresent: isPresent(),
        fill: fillable(),
      },
      phone: {
        scope: SALES_CONTACT_FORM_PHONE,
        isPresent: isPresent(),
        fill: fillable(),
      },
      message: {
        scope: SALES_CONTACT_FORM_MESSAGE,
        isPresent: isPresent(),
        fill: fillable(),
      },
      submit: {
        scope: SALES_CONTACT_FORM_SUBMIT,
        isPresent: isPresent(),
        click: clickable(),
      },
    },
  },

  enterpriseSection: {
    scope: PLANS_PAGE_ENTERPRISE_SECTION,
    isPresent: isPresent(),

    button: {
      scope: PLANS_PAGE_ENTERPRISE_BUTTON,
      isPresent: isPresent(),
      text: text(),
      href: attribute('href'),
    },
  },

  faqSection: {
    scope: PLANS_PAGE_FAQ_SECTION,
    isPresent: isPresent(),

    list: {
      scope: PLANS_PAGE_FAQ_LIST,
      isPresent: isPresent(),
      items: collection('.grid-item', {
        isPresent: isPresent(),
      })
    },
  },

  messageSection: {
    scope: PLANS_PAGE_MESSAGE_SECTION,
    isPresent: isPresent(),

    button: {
      scope: PLANS_PAGE_MESSAGE_BUTTON,
      isPresent: isPresent(),
      text: text(),
    },
  },

  thanks: {
    scope: PLANS_THANKS_PAGE_CONTAINER,
    isPresent: isPresent(),

    title: {
      scope: PLANS_THANKS_PAGE_TITLE,
      isPresent: isPresent(),
      text: text(),
    },
    image: {
      scope: PLANS_THANKS_PAGE_IMAGE,
      isPresent: isPresent(),
    },
    body: {
      scope: PLANS_THANKS_PAGE_BODY,
      isPresent: isPresent(),
      text: text(),
    },
    button: {
      scope: PLANS_THANKS_PAGE_BUTTON,
      isPresent: isPresent(),
      text: text(),
    },
  },
});
