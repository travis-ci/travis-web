/* global _gaq */
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { reads, filterBy, sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export const PLAN_DESCRIPTIONS = {
  1: 'Ideal for hobby projects',
  2: 'Best for small teams',
  5: 'Great for growing teams',
  10: 'Perfect for larger teams',
  default: '',
};

export default Controller.extend({
  config,

  auth: service(),

  plans: reads('model'),
  extendedPlans: computed('plans.[]', function () {
    const { plans } = this;
    return plans.map(plan => {
      const {
        annual,
        builds,
        currency,
        monthlyPrice,
        name,
        price
      } = plan;

      return {
        annual,
        builds,
        currency,
        description: PLAN_DESCRIPTIONS[builds] || PLAN_DESCRIPTIONS['default'],
        displayPrice: Math.round(monthlyPrice / 100),
        interval: `per month ${(annual ? 'billed annually' : '')}`,
        name,
        price,
      };
    });
  }),
  sortedPlans: sort('extendedPlans', (a, b) => (
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
      this.auth.signIn();
    }
  }
});
