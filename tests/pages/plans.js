import {
  collection,
  create,
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
  PLANS_PAGE_PRODUCT_LIST_ITEM,
  PLANS_PAGE_PRODUCT_BUTTON,

  PLANS_PAGE_OSS_SECTION,
  PLANS_PAGE_CONTACT_SECTION,
  PLANS_PAGE_ENTERPRISE_SECTION,
  PLANS_PAGE_FAQ_SECTION,
  PLANS_PAGE_MESSAGE_SECTION,
} from 'travis/tests/helpers/selectors';

export default create({
  visit: visitable('plans'),

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
      isPresent: isPresent()
    },

    list: {
      scope: PLANS_PAGE_PRODUCT_LIST,
      isPresent: isPresent(),
      items: collection(PLANS_PAGE_PRODUCT_LIST_ITEM, {
        isPresent: isPresent(),
      })
    },

    button: {
      scope: PLANS_PAGE_PRODUCT_BUTTON,
      isPresent: isPresent(),
      text: text()
    }
  },

  ossSection: {
    scope: PLANS_PAGE_OSS_SECTION,
    isPresent: isPresent(),
  },

  contactSection: {
    scope: PLANS_PAGE_CONTACT_SECTION,
    isPresent: isPresent(),
  },

  enterpriseSection: {
    scope: PLANS_PAGE_ENTERPRISE_SECTION,
    isPresent: isPresent(),
  },

  faqSection: {
    scope: PLANS_PAGE_FAQ_SECTION,
    isPresent: isPresent(),
  },

  messageSection: {
    scope: PLANS_PAGE_MESSAGE_SECTION,
    isPresent: isPresent(),
  },
});
