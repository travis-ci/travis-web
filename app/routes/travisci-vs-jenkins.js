import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default TravisRoute.extend(TailwindBaseMixin, {
  needsAuth: false,

  features: service(),

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
