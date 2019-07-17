import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default BasicRoute.extend(TailwindBaseMixin, {
  needsAuth: false,

  features: service(),

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  },

  model() {
    let plans;
    try {
      plans = this.store.filter('plan',
        {},
        (plan) => [
          'travis-ci-one-build',
          'travis-ci-two-builds',
          'travis-ci-five-builds',
          'travis-ci-ten-builds',
          'travis-ci-one-build-annual',
          'travis-ci-two-builds-annual',
          'travis-ci-five-builds-annual',
          'travis-ci-ten-builds-annual',
        ].includes(plan.id)
      );
    } catch (e) {
      plans = [
        {name: 'Bootstrap', builds: 1, price: 6900, annual: false, currency: 'USD'},
        {name: 'Startup', builds: 2, price: 12900, annual: false, currency: 'USD'},
        {name: 'Premium', builds: 10, price: 48900, annual: false, currency: 'USD'},
        {name: 'Small Business', builds: 5, price: 24900, annual: false, currency: 'USD'},
        {name: 'Small Business', builds: 5, price: 273900, annual: true, currency: 'USD'},
        {name: 'Bootstrap', builds: 1, price: 75900, annual: true, currency: 'USD'},
        {name: 'Premium', builds: 10, price: 537900, annual: true, currency: 'USD'},
        {name: 'Startup', builds: 2, price: 141900, annual: true, currency: 'USD'}
      ];
    }
    return plans;
  }
});
