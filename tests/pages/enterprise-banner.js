import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  isHidden,
  notHasClass,
  text
} = PageObject;

export const enterpriseBanners = {
  trialBanner: PageObject.create({
    scope: '.enterprise-banner-trial',
    text: text(),
    isHidden: isHidden()
  }),

  licenseBanner: PageObject.create({
    scope: '.enterprise-license-banner',
    text: text(),
    isHidden: isHidden()
  }),

  seatsBanner: PageObject.create({
    scope: '.enterprise-banner-seats',
    text: text(),
    isHidden: isHidden()
  })
};
