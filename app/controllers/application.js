import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import QueryParams from 'ember-parachute';
// import { UTM_FIELD_LIST } from 'travis/routes/application';

export const UTM_QUERY_PARAMS = new QueryParams({
  utm_campaign: { defaultValue: null, replace: true, refresh: true },
});

export default Controller.extend(UTM_QUERY_PARAMS.Mixin, {
  features: service(),

  setup({ queryParams }) {
    if (queryParams.utm_campaign) {
      this.resetUTMs();
    }
  },

  resetUTMs() {
    setTimeout(() => {
      this.resetQueryParams(['utm_campaign', 'utm_content']);
    }, 1);
  }
});
