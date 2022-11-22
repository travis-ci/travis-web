import ApplicationSerializer from 'travis/serializers/application';

export default ApplicationSerializer.extend({
  pushPayload(store, payload) {
    const modelClass = store.modelFor('plan');
    const json = this.normalizeArrayResponse(store, modelClass, payload);
    store.push(json);
  }
});
