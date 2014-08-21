Travis.SshKeyAdapter = Travis.Adapter.extend
  buildURL: (klass, id, record) ->
    url = @_super.apply this, arguments

  createRecord: (record) ->
    url = @buildURL(record.constructor, record.get('id'), record)
    self = this
    @ajax(url, record.toJSON(), "PATCH").then (data) ->
      self.didCreateRecord record, data
      record
