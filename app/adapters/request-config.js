import AdapterError from '@ember-data/adapter/error';
import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  queryRecord(store, type, { id, data }) {
    const url = `${this.buildURL('repo', id)}/request/config`;
    return this.ajax(url, 'POST', { data });
  },

  handleResponse(status, headers, body) {
    if (status == 400) {
      let error = JSON.parse(body.error_message).error;
      let type = error.type;
      let message = error.message; // TODO API should unwrap this

      // this is really shoehorning our custom error type and message
      // through Ember's limited AdapterError API. would it be better
      // to define a custom error class and overwrite its constructor
      // or something?
      throw new AdapterError([{ title: type, detail: message }]);
    }

    return this._super(...arguments);
  }
});
