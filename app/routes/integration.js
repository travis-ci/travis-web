import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default BasicRoute.extend(TailwindBaseMixin, {
  needsAuth: false,

  features: service(),

  beforeModel() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
