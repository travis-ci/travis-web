import Route from '@ember/routing/route';
import TailwindBaseMixin from 'travis/mixins/tailwind-base';
import { inject as service } from '@ember/service';

export default Route.extend(TailwindBaseMixin, {
  auth: service(),
  features: service(),

  beforeModel() {
    let pro = this.get('features.proVersion');
    if (!pro) {
      window.location.replace('https://app.travis-ci.com/signin');
    }
  },

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
