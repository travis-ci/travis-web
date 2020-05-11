import AdapterError from '@ember-data/adapter/error';
import V3Adapter from 'travis/adapters/v3';
import parseWithDefault from 'travis/utils/json-parser';

export default V3Adapter.extend({
  buildURL: function (modelName, modelId, snapshot, requestType, query) {
    const id = snapshot.belongsTo('repo').id;
    const endpoint = this._super('repo', id);
    return `${endpoint}/request/preview`;
  },

  handleResponse(status, headers, body) {
    if (status == 400) {
      const error = parseWithDefault(body.error_message).error || {};
      const { type, message } = error; // TODO API should unwrap this

      // this is really shoehorning our custom error type and message
      // through Ember's limited AdapterError API. would it be better
      // to define a custom error class and overwrite its constructor
      // or something?
      throw new AdapterError([{ title: type, detail: message }]);
    }

    return this._super(...arguments);
  }
});
