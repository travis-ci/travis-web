window.onTrue = (object, path, callback) ->
  if object.getPath(path)
    callback()
  else
    observer = ->
      object.removeObserver path, observer
      callback()
    object.addObserver path, observer

window.onceLoaded = ->
  objects = Array.prototype.slice.apply(arguments)
  callback = objects.pop()

  # sadly Ember.Enumerable.compact does not remove undefined values
  objects = (if object then object else null for object in objects).compact()
  object = objects.shift()

  if object
    path = if Ember.isArray(object) then 'firstObject.isLoaded' else 'isLoaded'
    onTrue object, path, ->
      if objects.length == 0
        callback(object)
      else
        onceLoaded.apply(objects + [callback])
  else
    callback object
