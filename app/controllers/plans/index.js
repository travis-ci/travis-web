import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy, or, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { APP_UTM_FIELDS, UTM_FIELD_LIST, UTM_STORAGE_PREFIX } from 'travis/routes/application';

const { plans } = config;

const referralSourceName = 'plans-page';
const outgoingUtmSource = `?utm_source=${referralSourceName}`;

function readUtmFromStorage(field) {
  return computed('model', function () { return this.storage.getItem(`${UTM_STORAGE_PREFIX}${field}`); });
}

export default Controller.extend({
  auth: service(),
  metrics: service(),
  storage: service(),

  config,
  referralSourceName,
  billingUrl: `${config.billingEndpoint}/${outgoingUtmSource}`,
  buildMatrixUrl: `${config.urls.buildMatrix}${outgoingUtmSource}`,
  enterpriseUrl: `${config.urls.enterprise}${outgoingUtmSource}`,

  qpUtmSource: reads(`model.appQueryParams.${APP_UTM_FIELDS.SOURCE}`),
  qpUtmCampaign: reads(`model.appQueryParams.${APP_UTM_FIELDS.CAMPAIGN}`),
  qpUtmMedium: reads(`model.appQueryParams.${APP_UTM_FIELDS.MEDIUM}`),
  qpUtmTerm: reads(`model.appQueryParams.${APP_UTM_FIELDS.TERM}`),
  qpUtmContent: reads(`model.appQueryParams.${APP_UTM_FIELDS.CONTENT}`),

  lsUtmSource: readUtmFromStorage(APP_UTM_FIELDS.SOURCE),
  lsUtmCampaign: readUtmFromStorage(APP_UTM_FIELDS.CAMPAIGN),
  lsUtmMedium: readUtmFromStorage(APP_UTM_FIELDS.MEDIUM),
  lsUtmTerm: readUtmFromStorage(APP_UTM_FIELDS.TERM),
  lsUtmContent: readUtmFromStorage(APP_UTM_FIELDS.CONTENT),

  utmSource: or('qpUtmSource', 'lsUtmSource'),
  utmCampaign: or('qpUtmCampaign', 'lsUtmCampaign'),
  utmMedium: or('qpUtmMedium', 'lsUtmMedium'),
  utmTerm: or('qpUtmTerm', 'lsUtmTerm'),
  utmContent: or('qpUtmContent', 'lsUtmContent'),

  plans: computed(() => plans),
  annualPlans: filterBy('plans', 'period', 'annual'),
  monthlyPlans: filterBy('plans', 'period', 'monthly'),
  plansToDisplay: computed(
    'showAnnual',
    'annualPlans',
    'monthlyPlans',
    function () {
      return this.showAnnual ? this.annualPlans : this.monthlyPlans;
    }
  ),

  showAnnual: true,
  scrollToContact: false,

  clearLocalUtms() {
    UTM_FIELD_LIST.forEach((field) => {
      this.storage.removeItem(`${UTM_STORAGE_PREFIX}${field}`);
    });
  },

  actions: {
    gaCta(location) {
      const page = `/virtual/signup?${location}`;
      this.metrics.trackPage({ page });
      this.auth.signIn();
    },

    toggleContactScroll() {
      this.set('scrollToContact', true);
      setTimeout(
        () => this.set('scrollToContact', false),
        500
      );
    },

    contactSuccess() {
      this.clearLocalUtms();
      this.transitionToRoute('plans.thank-you', { queryParams: {
        [APP_UTM_FIELDS.SOURCE]: null,
        [APP_UTM_FIELDS.CAMPAIGN]: null,
        [APP_UTM_FIELDS.MEDIUM]: null,
        [APP_UTM_FIELDS.TERM]: null,
        [APP_UTM_FIELDS.CONTENT]: null,
      } });
    },
  }
});
