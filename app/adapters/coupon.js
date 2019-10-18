import V3Adapter from 'travis/adapters/v3';
import { InvalidError } from '@ember-data/adapter/error';

export default V3Adapter.extend({
  pathForType: function () {
    return 'coupons';
  },

  handleResponse(status, headers, payload) {
    if (status === 404 && payload.error_message) {
      return new InvalidError([
        {
          'source': { 'pointer': '/data/attributes/id'},
          'detail': payload.error_message,
        }
      ]);
    }
    return this._super(...arguments);
  }
});
