import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({

  buildURL(modelName, id, snapshot, requestType, organizationId) {
    const url = this._super(...arguments);
    let route = '/plans_for/user';
    if (organizationId) {
      route = `/plans_for/organization/${organizationId}`;
    }
    return url + route;
  },

  findAll(store, type, sinceToken, snapshotRecordArray) {
    let organizationId = snapshotRecordArray.adapterOptions && snapshotRecordArray.adapterOptions.organizationId;
    let url = this.buildURL(null, null, null, null, organizationId);
    return this.ajax(url, 'GET');
  }
});
