`import Ember from 'ember'`
`import ApplicationAdapter from 'travis/adapters/application'`

Adapter = ApplicationAdapter.extend
  namespace: 'settings'

  find: (store, type, id, record) ->
    @ajax(this.urlPrefix() + '/ssh_key/' + id, 'GET')

  deleteRecord: (store, type, record) ->
    id = Ember.get(record, 'id')

    @ajax(this.urlPrefix() + '/ssh_key/' + id, "DELETE");

  createRecord: (store, type, record) ->
    data = {};
    serializer = store.serializerFor(type.typeKey);
    serializer.serializeIntoHash(data, type, record, { includeId: true });

    id = Ember.get(record, 'id')

    this.ajax(this.urlPrefix() + '/ssh_key/' + id, "PATCH", { data: data })

`export default Adapter`
