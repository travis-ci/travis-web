import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  updateRecord(store, type, snapshot) {
    const data = this.serialize(snapshot, { update: true });
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
    return this.ajax(url, 'PATCH', { data });
  },
});
