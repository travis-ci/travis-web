get = Ember.get

Travis.SshKeyAdapter = Travis.ApplicationAdapter.extend
  namespace: 'settings'

  createRecord: (store, type, record) ->
    data = {};
    serializer = store.serializerFor(type.typeKey);
    serializer.serializeIntoHash(data, type, record, { includeId: true });

    this.ajax(this.buildURL(type.typeKey, null, record), "POST", { data: data })
