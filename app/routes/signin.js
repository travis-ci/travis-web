import Route from '@ember/routing/route';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';
import { inject as service } from '@ember/service';

export default Route.extend(TailwindBaseMixin, {
  auth: service(),

  queryParams: {
    redirectUrl: {
      refreshModel: true
    }
  },

  model({ redirectUrl }) {
    if (redirectUrl) {
      this.auth.setProperties({ redirectUrl });
    }
  }
});
