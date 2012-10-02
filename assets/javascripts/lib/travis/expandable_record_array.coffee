Travis.ExpandableRecordArray = DS.RecordArray.extend
  isLoaded: false
  isLoading: false

  load: (array) ->
    @set 'isLoading', true
    self = this

    observer = ->
      if @get 'isLoaded'
        content = self.get 'content'

        array.removeObserver 'isLoaded', observer
        array.forEach (record) ->
          self.pushObject record

        self.set 'isLoading', false
        self.set 'isLoaded',  true

    array.addObserver 'isLoaded', observer

  pushObject: (record) ->
    ids      = @get 'content'
    id       = record.get 'id'
    clientId = record.get 'clientId'

    return if ids.contains clientId

    ids.pushObject clientId
