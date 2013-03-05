get = Ember.get

Travis.ChunkBuffer = Em.ArrayProxy.extend
  timeout: 5000
  checkTimeoutFrequency: 1000
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
    Em.ArrayProxy.create(Em.SortableMixin,
      content: []
      sortProperties: ['number']
      sortAscending: true
    )
  ).property()

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    if addedCount
      queue = @get('queue.content')
      addedObjects = array.slice(index, index + addedCount)
      console.log 'Added log parts with numbers:', addedObjects.map( (element) -> get(element, 'number') )
      queue.pushObjects addedObjects
      @check()
      @inserted()

  check: ->
    queue = @get('queue')
    next  = @get('next')

    arrangedContent = @get('arrangedContent')
    toPush = []

    while queue.get('firstObject.number') <= next
      element = queue.shiftObject()
      if get(element, 'number') == next
        toPush.pushObject get(element, 'content')
        next += 1

    if toPush.length
      arrangedContent.pushObjects toPush

    @set('next', next)

  inserted: ->
    now = @now()
    @lastInsert = now

  checkTimeout: ->
    now = @now()
    if now - @lastInsert > @get('timeout')
      @giveUpOnMissingParts()
    @set 'runLaterId', Ember.run.later(this, @checkTimeout, @get('checkTimeoutFrequency'))

  willDestroy: ->
    Ember.run.cancel @get('runLaterId')
    @_super.apply this, arguments

  now: ->
    (new Date()).getTime()

  giveUpOnMissingParts: ->
    if number = @get('queue.firstObject.number')
      console.log 'Giving up on missing parts in the buffer, switching to:', number
      @set('next', number)
      @check()
