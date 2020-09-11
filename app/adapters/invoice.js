import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    const { type, subscriptionId } = query;
    const route = type === 2 ? 'v2_subscription' : 'subscription';
    if (requestType === 'query' && subscriptionId) {
      let prefix = this.urlPrefix();
      return `${prefix}/${route}/${subscriptionId}/invoices`;
    } else {
      throw new Error(`The invoices adapter only supports a
        query request type with a query including subscription_id`);
    }
  },

  // This overrides the parent implementation to ignore the query parameters
  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    return this.ajax(url, 'GET');
  }
});
