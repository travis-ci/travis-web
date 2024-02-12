import Route from '@ember/routing/route';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';
import { inject as service } from '@ember/service';

export default Route.extend(TailwindBaseMixin, {
  auth: service(),
  features: service(),

  queryParams: {
    redirectUrl: {
      refreshModel: true
    }
  },

  model({ redirectUrl }) {
    console.log("SIGNIN");
    if (redirectUrl) {
      this.auth.setProperties({ redirectUrl });
    }

    console.log("SIGNIN2");
  }
});
