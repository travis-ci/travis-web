require 'travis/adapter'
get = Ember.get

Travis.EnvVarsAdapter = Travis.Adapter.extend
  buildURL: (klass, id, record) ->
    url = @_super.apply this, arguments
    if record && (repo_id = get(record, 'repository_id') || get(record, 'repo.id'))
      url = "#{url}?repository_id=#{repo_id}"

    url

  saveRecord: (record) ->
    primaryKey = get(record.constructor, 'primaryKey')
    url = this.buildURL(record.constructor, get(record, primaryKey), record)
    self = this

    return this.ajax(url, record.toJSON(), "PUT").then (data) ->
      self.didSaveRecord(record, data)
      return record


