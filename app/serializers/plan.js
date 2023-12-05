import ApplicationSerializer from "./application";

export default ApplicationSerializer.extend({

});

export function pushPayload(store, payloads) {
  const applicationSerializer = store.serializerFor('application');
  const json = applicationSerializer.normalizeArrayResponse(store, store.modelFor('plan'), payloads);
  store.push(json);
}
