import {
  create,
  isPresent,
  visitable
} from 'ember-cli-page-object';

import {
  PLANS_PAGE_SECTION_HEADER,
  PLANS_PAGE_SECTION_PRODUCT,
  PLANS_PAGE_SECTION_OSS,
  PLANS_PAGE_SECTION_CONTACT,
  PLANS_PAGE_SECTION_ENTERPRISE,
  PLANS_PAGE_SECTION_FAQ,
  PLANS_PAGE_SECTION_MESSAGE,
} from 'travis/tests/helpers/selectors';

export default create({
  visit: visitable('plans'),

  headerSection: {
    scope: PLANS_PAGE_SECTION_HEADER,
    isPresent: isPresent(),
  },

  productSection: {
    scope: PLANS_PAGE_SECTION_PRODUCT,
    isPresent: isPresent(),
  },

  ossSection: {
    scope: PLANS_PAGE_SECTION_OSS,
    isPresent: isPresent(),
  },

  contactSection: {
    scope: PLANS_PAGE_SECTION_CONTACT,
    isPresent: isPresent(),
  },

  enterpriseSection: {
    scope: PLANS_PAGE_SECTION_ENTERPRISE,
    isPresent: isPresent(),
  },

  faqSection: {
    scope: PLANS_PAGE_SECTION_FAQ,
    isPresent: isPresent(),
  },

  messageSection: {
    scope: PLANS_PAGE_SECTION_MESSAGE,
    isPresent: isPresent(),
  },
});
