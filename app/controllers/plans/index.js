import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const { plans } = config;

const referralSourceName = 'plans-page';

const ANCHOR = {
  ENTERPRISE_SECTION: 'enterprise-section',
};

export default Controller.extend({
  queryParams: ['anchor'],

  auth: service(),
  metrics: service(),

  config,
  referralSourceName,
  anchor: '',
  toEnterpriseSection: equal('anchor', ANCHOR.ENTERPRISE_SECTION),
  billingUrl: `${config.billingEndpoint}/account/subscription`,
  buildMatrixUrl: config.urls.buildMatrix,
  enterpriseUrl: config.urls.enterprise,

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
    signIn() {
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
