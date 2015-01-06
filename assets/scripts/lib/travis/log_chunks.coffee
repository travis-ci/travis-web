Travis.LogChunks = Em.ArrayProxy.extend
  timeout: 30000

  init: ->
    @setTimeout()

    @_super.apply(this, arguments)

  resetTimeout: ->
    id = @get('timeoutId')
    clearTimeout(id)

    @setTimeout()

  setTimeout: ->
    id = setTimeout( =>
      return if @get('finalized') || @get('isDestroyed')

      @triggerMissingParts()
      @setTimeout()
    , @get('timeout'))

    @set('timeoutId', id)

  triggerMissingParts: ->
    callback = @get('missingPartsCallback')
    return unless callback

    content  = @get('content')
    last     = @get('last')
    missing  = null
    after = null

    if last
      existing = content.mapBy('number')
      all      = [1..last.number]

      missing = all.removeObjects(existing)

      unless last.final
        # if last chunk is not final, we should try a few next chunks. At the moment
        # there's no API for that, so let's just try 10 next chunks
        after = last.number

    callback(missing, after)

  last: (->
    max = -1
    last = null
    for part in @get('content')
      if part.number > max
        max = part.number
        last = part

    last
  ).property('content.[]', 'final')

  final: (->
    @get('content').findBy('final', true)
  ).property()

  tryFinalizing: ->
    content = @get('content')
    last    = @get('last')

    if last.final && last.number == content.length
      # we have all parts
      @set('finalized', true)

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    if addedCount
      addedObjects = array.slice(index, index + addedCount)
      for part in addedObjects
        if part.final
          @notifyPropertyChange('final')

      Ember.run this, ->
        Ember.run.once this, ->
          @tryFinalizing()
          @resetTimeout()
