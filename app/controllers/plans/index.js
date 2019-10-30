import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const { plans } = config;

const referralSourceName = 'plans-page';

export default Controller.extend({
  auth: service(),
  metrics: service(),

  config,
  referralSourceName,
  billingUrl: config.billingEndpoint,
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
