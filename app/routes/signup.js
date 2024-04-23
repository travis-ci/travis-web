import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';

export default Route.extend(TailwindBaseMixin, {
  auth: service(),
  features: service(),
  router: service(),

  needsAuth: false,

  beforeModel() {
    if (this.get('auth.signedIn')) {
      this.router.transitionTo('index');
    }
  },
});
