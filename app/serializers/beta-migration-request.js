import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  pushPayload(store, payload) {
    const modelClass = store.modelFor('beta-migration-request');
    const json = this.normalizeArrayResponse(store, modelClass, payload);
    store.push(json);
  },

  normalize(modelClass, payload = {}) {
    if (payload.organizations) {
      payload['organization_ids'] = payload.organizations;
    }
    return this._super(...arguments);
  }

});
