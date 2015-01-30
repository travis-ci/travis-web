Travis.ExpandableRecordArray = DS.RecordArray.extend
  isLoaded: false
  isLoading: false

  promise: (->
    self = this
    new Ember.RSVP.Promise (resolve, reject) ->
      observer = ->
        if self.get('isLoaded')
          resolve(self)
          self.removeObserver('isLoaded', observer)
          true

      unless observer()
        self.addObserver 'isLoaded', observer
  ).property()

  load: (array) ->
    @set 'isLoading', true
    array.then =>
      array.forEach (record) =>
        @pushObject(record) unless @contains(record)

      @set 'isLoading', false
      @set 'isLoaded',  true

  observe: (collection, filterWith) ->
    @set 'filterWith', filterWith
    collection.addArrayObserver this,
      willChange: 'observedArrayWillChange'
      didChange: 'observedArraydidChange'

  observedArrayWillChange: (array, index, removedCount, addedCount) ->
    removedObjects = array.slice index, index + removedCount
    for object in removedObjects
      @removeObject(object)

  observedArraydidChange: (array, index, removedCount, addedCount) ->
    addedObjects = array.slice index, index + addedCount
    for object in addedObjects
      # TODO: I'm not sure why deleted objects get here, but I'll just filter them
      # for now
      if !object.get('isDeleted') && @get('filterWith').call(this, object)
        @pushObject(object) unless @contains(object)

  pushObject: (record) ->
    if content = @get('content')
      content.pushObject(record) unless content.contains(record)
