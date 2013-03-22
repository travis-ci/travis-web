get = Ember.get

Travis.ChunkBuffer = Em.ArrayProxy.extend
  timeout: 5000
  checkTimeoutFrequency: 5000
  start: 1
  next: 1

  init: ->
    @_super.apply this, arguments

    @lastInsert = 0

    @set('next', @get('start'))

    @checkTimeout()

    if @get('content.length')
      @get('queue.content').pushObjects @get('content').toArray()

  arrangedContent: (->
    []
  ).property('content')

  addObject: (obj) ->
    @get('content').pushObject(obj)

  removeObject: (obj) ->
    @get('content').removeObject(obj)

  replaceContent: (idx, amt, objects) ->
    @get('content').replace(idx, amt, objects)

  queue: (->
    Em.ArrayProxy.extend(Em.SortableMixin, {
      content: []
      sortProperties: ['number']
      sortAscending: true
    }).create()
  ).property()

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    if addedCount
      queue = @get('queue')
      addedObjects = array.slice(index, index + addedCount)
      console.log 'Added log parts with numbers:', addedObjects.map( (element) -> get(element, 'number') )+'', 'current', @get('next')
      queue.pushObjects addedObjects
      @check()

  check: ->
    queue = @get('queue')
    next  = @get('next')

    arrangedContent = @get('arrangedContent')
    toPush = []

    while queue.get('firstObject.number') <= next
      element = queue.shiftObject()
      if get(element, 'number') == next
        @finalize() if get(element, 'final')
        toPush.pushObject get(element, 'content')
        next += 1

    if toPush.length
      arrangedContent.pushObjects toPush
      @inserted()

    @set('next', next)

  inserted: ->
    now = @now()
    @lastInsert = now

  finalize: ->
    clearTimeout @get('runLaterId')

  checkTimeout: ->
    now = @now()
    if now - @lastInsert > @get('timeout')
      @giveUpOnMissingParts()
    @set 'runLaterId', setTimeout((=> @checkTimeout()), @get('checkTimeoutFrequency'))

  willDestroy: ->
    @finalize()
    @_super.apply this, arguments

  now: ->
    (new Date()).getTime()

  giveUpOnMissingParts: ->
    if number = @get('queue.firstObject.number')
      console.log 'Giving up on missing parts in the buffer, switching to:', number
      @set('next', number)
      @check()
