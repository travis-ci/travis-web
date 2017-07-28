import V3Adapter from 'travis/adapters/v3';
import { service } from 'ember-decorators/service';

export default V3Adapter.extend({
  @service auth: null,

  buildURL(modelName, id, snapshot, requestType) {
    let url = this._super(...arguments);
    if (requestType === 'GET') {
      let replacement = `user/${this.get('auth.currentUser.id')}/beta_features`;
      url = url.replace(/beta_features/, replacement);
    } else {
      if (requestType === 'PUT') { requestType = 'PATCH'; }
      let replacement = `user/${this.get('auth.currentUser.id')}/beta_feature`;
      url = url.replace(/beta_feature/, replacement);
    }
    return url;
  },

  updateRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot);

    let { enabled } = data;
    data = { 'beta_feature.enabled': enabled };

    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');

    return this.ajax(url, 'PATCH', { data: data });
  }
});
