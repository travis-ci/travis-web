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
    const data = this.serialize(snapshot, { update: true });
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
    return this.ajax(url, 'PATCH', { data });
  }
});
