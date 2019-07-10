/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { reads, filterBy, sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  config,

  auth: service(),

  plans: reads('model'),
  sortedPlans: sort('plans', (a, b) => (
    a.price > b.price ? 1 : a.price < b.price ? -1 : 0
  )),
  annualPlans: filterBy('sortedPlans', 'annual', true),
  monthlyPlans: filterBy('sortedPlans', 'annual', false),
  filteredPlans: computed(
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
      this.get('auth').signIn();
    }
  }
});
