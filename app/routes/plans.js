import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';
import config from 'travis/config/environment';

export default BasicRoute.extend(TailwindBaseMixin, {
  needsAuth: false,

  features: service(),
  auth: service(),

  beforeModel() {
    let pro = this.get('features.proVersion');
    if (!this.auth.signedIn && config.environment !== 'test' && pro) {
      window.location.replace('https://www.travis-ci.com/pricing');
    }
  },

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
