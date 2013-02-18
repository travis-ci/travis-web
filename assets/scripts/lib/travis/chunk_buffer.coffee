Travis.ChunkBuffer = Em.ArrayProxy.extend Ember.MutableEnumerable,
  timeout: 15000
  start: 0
  next: 0

  init: ->
    @_super.apply this, arguments

    @set('next', @get('start'))

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
    console.log 'content array did change'
    @_super.apply this, arguments

    if addedCount
      queue   = @get('queue.content')
      queue.pushObjects array.slice(index, index + addedCount)
      @check()

  check: ->
    queue = @get('queue')
    next  = @get('next')

    arrangedContent = @get('arrangedContent')
    toPush = []

    while queue.get('firstObject.number') == next
      toPush.pushObject queue.shiftObject().get('content')
      next += 1

    arrangedContent.pushObjects toPush if toPush.length

    @set('next', next)
