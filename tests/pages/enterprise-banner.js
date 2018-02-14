import PageObject from 'travis/tests/page-object';

let {
  isHidden,
  text
} = PageObject;

export const enterpriseBanners = {
  trialBanner: PageObject.create({
    scope: '.enterprise-banner-trial'
  }),

  licenseBanner: PageObject.create({
    scope: '.enterprise-license-banner'
  }),

  seatsBanner: PageObject.create({
    scope: '.enterprise-banner-seats'
  })
};
