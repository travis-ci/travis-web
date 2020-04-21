import AdapterError from '@ember-data/adapter/error';
import V3Adapter from 'travis/adapters/v3';
import parseWithDefault from 'travis/utils/json-parser';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    return `${this._super('repo', snapshot.belongsTo('repo').id)}/request/preview`;
  },

  handleResponse(status, headers, body) {
    if (status == 400) {
      let error = parseWithDefault(body.error_message).error || {};
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
