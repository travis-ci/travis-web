import { create } from 'ember-cli-page-object';

export const enterpriseBanners = {
  trialBanner: create({
    scope: '.enterprise-banner-trial'
  }),

  licenseBanner: create({
    scope: '.enterprise-license-banner'
  }),

  seatsBanner: create({
    scope: '.enterprise-banner-seats'
  })
};
