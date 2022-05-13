import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default Route.extend(TailwindBaseMixin, {
  auth: service(),
  features: service(),

  needsAuth: false,

  beforeModel() {
    let pro = this.get('features.proVersion');
    if (!pro) {
      window.location.replace('https://app.travis-ci.com/signup');
    }

    if (this.get('auth.signedIn')) {
      this.transitionTo('index');
    }
  },
});
