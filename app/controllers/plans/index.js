import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { equal, filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

const { plans } = config;

const referralSourceName = 'plans-page';

const SECTION = {
  NONE: '',
  CONTACT: 'contact',
};

export default Controller.extend({
  auth: service(),
  metrics: service(),

  queryParams: ['section'],
  section: SECTION.NONE,

  config,
  referralSourceName,
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
  scrollToContact: equal('section', SECTION.CONTACT),

  actions: {
    signIn() {
      this.auth.signIn();
    },

    toggleContactScroll() {
      this.set('section', SECTION.NONE);
      next(() => this.set('section', SECTION.CONTACT));
    },

    contactSuccess() {
      this.transitionToRoute('plans.thank-you');
    },
  }
});
