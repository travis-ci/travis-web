`import Ember from 'ember'`
`import ApplicationAdapter from 'travis/adapters/application'`

Adapter = ApplicationAdapter.extend
  namespace: 'settings'

  buildURL: (type, id, record) ->
    url = @_super.apply this, arguments

    if record && (repoId = Ember.get(record, 'repo.id'))
      delimiter = if url.indexOf('?') != -1 then '&' else '?'
      url = "#{url}#{delimiter}repository_id=#{repoId}"

    url

  updateRecord: (store, type, record) ->
    data = {};
    serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, record);

    id = Ember.get(record, 'id');

    this.ajax(this.buildURL(type.typeKey, id, record), "PATCH", { data: data })

`export default Adapter`
