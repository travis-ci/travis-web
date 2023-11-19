export default function pushPayload(store, payloads) {
    const applicationSerializer = store.serializerFor('application');
    const json = applicationSerializer.normalizeArrayResponse(store, store.modelFor('plan'), payloads);
    store.push(json);
}
