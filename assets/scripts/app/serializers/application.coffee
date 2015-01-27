Travis.ApplicationSerializer = DS.ActiveModelSerializer.extend
  defaultSerializer: 'application'
  serializer: 'application'

  extractSingle: (store, primaryType, rawPayload, recordId) ->
    #newPayload = {}

    #if payload.build

    @_super.apply(this, arguments)

  extractArray: (store, type, payload) ->
    @_super.apply(this, arguments)
