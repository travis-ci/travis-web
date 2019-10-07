import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const { plans } = config;

const utmSourceName = 'plans-page';
const utmSource = `?utm_source=${utmSourceName}`;

export default Controller.extend({
  config,

  auth: service(),
  metrics: service(),

  utmSourceName,
  billingUrl: `${config.billingEndpoint}/${utmSource}`,
  buildMatrixUrl: `${config.urls.buildMatrix}${utmSource}`,
  enterpriseUrl: `${config.urls.enterprise}${utmSource}`,

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
