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
    return this.store.filter('plan',
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
  }
});
