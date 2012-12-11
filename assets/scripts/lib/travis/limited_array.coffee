Travis.LimitedArray = Em.ArrayProxy.extend
  limit: 10
  isLoadedBinding: 'content.isLoaded'
  insertAtTheBeginning: true

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
    if totalLength > limit
      totalLength - limit
    else
      0
  ).property('totalLength', 'limit')

  isMore: (->
    !@get('disabled') && @get('leftLength') > 0
  ).property('leftLength')

  showAll: ->
    @set 'limit', 1000000000
    @set 'disabled', true


  contentArrayWillChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    return if @get('disabled')

    if removedCount
      arrangedContent = @get 'arrangedContent'
      removedObjects = array.slice(index, index + removedCount);
      console.log 'willChange', @get('name'), index, removedCount, addedCount, arrangedContent.map( (j) -> "#{j.get('repoSlug')}-#{j.get('number')}" ), removedObjects.map( (j) -> "#{j.get('repoSlug')}-#{j.get('number')}" )
      arrangedContent.removeObjects(removedObjects)

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    return if @get('disabled')

    if addedCount
      arrangedContent = @get('arrangedContent')
      addedObjects = array.slice(index, index + addedCount)
      for object in addedObjects
        if @get 'insertAtTheBeginning'
          arrangedContent.unshiftObject(object)
        else
          arrangedContent.pushObject(object)

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
          if @get('insertAtTheBeginning')
            arrangedContent.unshiftObject(next)
          else
            arrangedContent.pushObject(next)
        count -= 1
