Travis.LimitedArray = Em.ArrayProxy.extend
  limit: 10
  isLoadedBinding: 'content.isLoaded'

  init: ->
    @_super.apply this, arguments

  arrangedContent: (->
    content = @get('content')
    if @get('disabled')
      content
    else if content
      content.slice(0, @get('limit'))
  ).property('content', 'limit', 'disabled')

  totalLength: (->
    @get('content.length')
  ).property('content.length')

  leftLength: (->
    totalLength = @get('totalLength')
    limit       = @get('limit')

    if @get('disabled') || totalLength <= limit
      0
    else
      totalLength - limit
  ).property('totalLength', 'limit', 'disabled')

  isMore: (->
    !@get('disabled') && @get('leftLength') > 0
  ).property('leftLength')

  showAll: ->
    @set 'disabled', true

  contentArrayWillChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    return if @get('disabled')

    if removedCount
      arrangedContent = @get 'arrangedContent'
      removedObjects = array.slice(index, index + removedCount);
      arrangedContent.removeObjects(removedObjects)

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    return if @get('disabled')

    limit = @get('limit')

    if addedCount
      if index < limit
        addedObjects = array.slice(index, index + addedCount)
        @get('arrangedContent').replace(index, 0, addedObjects)

    @balanceArray()

  balanceArray: ->
    limit  = @get 'limit'
    arrangedContent = @get 'arrangedContent'
    length = arrangedContent.get 'length'
    content = @get 'content'

    if length > limit
      arrangedContent.replace(limit, length - limit)
    else if length < limit && content.get('length') > length
      count = limit - length
      while count > 0
        if next = content.find( (object) -> !arrangedContent.contains(object) )
          arrangedContent.pushObject(next)
        count -= 1
