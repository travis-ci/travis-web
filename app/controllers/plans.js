/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

const { plans } = config;

export default Controller.extend({
  config,

  auth: service(),

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

  contactName: null,

  contactFormSend: task(function* () {
    const { contactName } = this;
    return yield contactName;
  }),

  actions: {
    gaCta(location) {
      if (config.gaCode) {
        const page = `/virtual/signup?${location}`;
        _gaq.push(['_trackPageview', page]);
      }
      this.auth.signIn();
    },

    contactFormSubmit() {
      return false;
    }
  }
});
