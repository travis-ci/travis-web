Travis.LimitedArray = Em.ArrayProxy.extend
  limit: 10
  isLoadedBinding: 'content.isLoaded'

  init: ->
    @_super.apply this, arguments

  arrangedContent: (->
    if content = @get('content')
      content.slice(0, @get('limit'))
  ).property('content')

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments
    if addedCount > 0
      addedObjects = array.slice(index, index + addedCount)
      arrangedContent = @get('arrangedContent')
      for object in addedObjects
        arrangedContent.unshiftObject(object)

      limit  = @get 'limit'
      length = arrangedContent.get 'length'
      if length > limit
        arrangedContent.replace(limit, length - limit)
