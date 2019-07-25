/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const { plans } = config;

export default Controller.extend({
  config,

  auth: service(),

  plans: computed(() => plans),
  annualPlans: reads('plans.annual'),
  monthlyPlans: reads('plans.monthly'),
  plansToDisplay: computed(
    'showAnnual',
    'annualPlans',
    'monthlyPlans',
    function () {
      return this.showAnnual ? this.annualPlans : this.monthlyPlans;
    }
  ),

  showAnnual: true,

  actions: {
    gaCta(location) {
      if (config.gaCode) {
        const page = `/virtual/signup?${location}`;
        _gaq.push(['_trackPageview', page]);
      }
      this.auth.signIn();
    }
  }
});
