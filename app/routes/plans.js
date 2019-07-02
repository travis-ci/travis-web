import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import UseTailwindMixin from 'travis/mixins/use-tailwind';

export default BasicRoute.extend(UseTailwindMixin, {
  needsAuth: false,

  features: service(),

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
