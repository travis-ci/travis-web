Travis.ChunkBuffer = Em.ArrayProxy.extend
  timeout: 15000
  start: 0
  next: 0

  init: ->
    @_super.apply this, arguments

    if @get('content.length')
      @get('queue.content').pushObjects @get('content').toArray()

  arrangedContent: (->
    []
  ).property('content')

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

    while queue.get('firstObject.number') == next
      arrangedContent.pushObject queue.shiftObject().get('content')
      next += 1

    @set('next', next)
