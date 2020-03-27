import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import QueryParams from 'ember-parachute';
import { UTM_FIELDS, UTM_FIELD_NAMES } from 'travis/services/utm';

export const UTM_QUERY_PARAMS = new QueryParams({
  [UTM_FIELDS.CAMPAIGN]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.CONTENT]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.MEDIUM]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.SOURCE]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.TERM]: { defaultValue: null, replace: true, refresh: true },
});

export default Controller.extend(UTM_QUERY_PARAMS.Mixin, {
  features: service(),
  utm: service(),

  setup({ queryParams }) {
    this.utm.capture(queryParams);
  },

  resetUTMs() {
    try {
      this.resetQueryParams([...UTM_FIELD_NAMES]);
    } catch (e) {}
  }
});
