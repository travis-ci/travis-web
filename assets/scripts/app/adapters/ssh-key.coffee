get = Ember.get

ApplicationAdapter = Travis.ApplicationAdapter

Adapter = ApplicationAdapter.extend
  namespace: 'settings'

  createRecord: (store, type, record) ->
    data = {};
    serializer = store.serializerFor(type.typeKey);
    serializer.serializeIntoHash(data, type, record, { includeId: true });

    this.ajax(this.buildURL(type.typeKey, null, record), "POST", { data: data })

Travis.SshKeyAdapter = Adapter
