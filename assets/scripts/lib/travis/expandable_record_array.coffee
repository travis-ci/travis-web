Travis.ExpandableRecordArray = Ember.RecordArray.extend
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

  observe: (collection, filterWith) ->
    @set 'filterWith', filterWith
    collection.addArrayObserver this,
      willChange: 'observedArrayWillChange'
      didChange: 'observedArraydidChange'

  observedArrayWillChange: (->)
  observedArraydidChange: (array, index, removedCount, addedCount) ->
    addedObjects = array.slice index, index + addedCount
    for object in addedObjects
      if @get('filterWith').call this, object
        @pushObject object

  pushObject: (record) ->
    @get('content').pushObject(record)
