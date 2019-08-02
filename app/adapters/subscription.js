import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildURL(modelName, id, snapshot, requestType) {
    let url = this._super(...arguments);
    if (requestType === 'updateRecord') {
      url = `${url}/address`;
    }
    return url;
  },

  updateRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot);

    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');

    const updatedBillingInfo = Object.keys(data).reduce((accumulator, attribute) => {
      const splitAttribute = attribute.split('.');
      const leftAttribute = splitAttribute[0];
      const rightAttribute = splitAttribute[1];
      if (leftAttribute === 'billing_info') {
        accumulator[`subscription.${rightAttribute}`] = data[`billing_info.${rightAttribute}`];
      }
      return accumulator;
    }, {});

    return this.ajax(url, 'PATCH', { data: updatedBillingInfo });
  }
});
