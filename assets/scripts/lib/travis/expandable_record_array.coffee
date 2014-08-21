Travis.ExpandableRecordArray = Ember.RecordArray.extend
  isLoaded: false
  isLoading: false

  promise: (->
    console.log 'promise'
    self = this
    new Ember.RSVP.Promise (resolve, reject) ->
      console.log 'inside promise'
      observer = ->
        console.log 'observer', self.get('isLoaded')
        if self.get('isLoaded')
          console.log 'resolve'
          resolve(self)
          self.removeObserver('isLoaded', observer)
          true

      unless observer()
        self.addObserver 'isLoaded', observer
  ).property()

  load: (array) ->
    @set 'isLoading', true
    self = this

    observer = ->
      if @get 'isLoaded'
        content = self.get 'content'

        array.removeObserver 'isLoaded', observer
        array.forEach (record) ->
          self.pushObject(record) unless self.contains(record)

        self.set 'isLoading', false
        self.set 'isLoaded',  true

    array.addObserver 'isLoaded', observer

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
