import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { LEAD_UTM_FIELDS } from 'travis/models/lead';

const { plans } = config;

const referralSourceName = 'plans-page';
const outgoingUtmSource = `?utm_source=${referralSourceName}`;
const supportedUtmFields = Object.values(LEAD_UTM_FIELDS);

export default Controller.extend({
  queryParams: supportedUtmFields,

  auth: service(),
  metrics: service(),

  config,
  referralSourceName,
  billingUrl: `${config.billingEndpoint}/${outgoingUtmSource}`,
  buildMatrixUrl: `${config.urls.buildMatrix}${outgoingUtmSource}`,
  enterpriseUrl: `${config.urls.enterprise}${outgoingUtmSource}`,

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
      this.transitionToRoute('plans.thank-you');
    },
  }
});
