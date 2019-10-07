/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const { plans } = config;

const leadSourceName = 'plans-page';
const outgoingUtmSource = `?utm_source=${leadSourceName}`;

export default Controller.extend({
  config,

  auth: service(),

  leadSourceName,
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
      if (config.gaCode) {
        const page = `/virtual/signup?${location}`;
        _gaq.push(['_trackPageview', page]);
      }
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
