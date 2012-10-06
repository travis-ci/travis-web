$.fn.extend
  outerHtml: ->
    $(this).wrap('<div></div>').parent().html()

  outerElement: ->
    $($(this).outerHtml()).empty()

  flash: ->
    Utils.flash this

  unflash: ->
    Utils.unflash this

  filterLog: ->
    @deansi()
    @foldLog()

  deansi: ->
    @html Utils.deansi(@html())

  foldLog: ->
    @html Utils.foldLog(@html())

  unfoldLog: ->
    @html Utils.unfoldLog(@html())

  updateTimes: ->
    Utils.updateTimes this

  activateTab: (tab) ->
    Utils.activateTab this, tab

  timeInWords: ->
    $(this).each ->
      $(this).text Utils.timeInWords(parseInt($(this).attr('title')))

  updateGithubStats: (repo) ->
    Utils.updateGithubStats repo, $(this)

$.extend
  isEmpty: (obj) ->
    if $.isArray(obj)
      !obj.length
    else if $.isObject(obj)
      !$.keys(obj).length
    else
      !obj

  isObject: (obj) ->
    # does this work as expected?
    Object.prototype.toString.call(obj) == '[object Object]'

  keys: (obj) ->
    keys = []
    $.each obj, (key) -> keys.push key
    keys

  values: (obj) ->
    values = []
    $.each obj, (key, value) -> values.push value
    values

  underscore: (string) ->
    string[0].toLowerCase() + string.substring(1).replace /([A-Z])?/g, (match, chr) ->
      if chr then "_#{chr.toUpperCase()}" else ''

  camelize: (string, uppercase) ->
    string = if uppercase == false then $.underscore(string) else $.capitalize(string)
    string.replace /_(.)?/g, (match, chr) ->
      if chr then chr.toUpperCase() else ''

  capitalize: (string) ->
    string[0].toUpperCase() + string.substring(1)

  compact: (object) ->
    $.grep(object, (value) -> !!value)

  all: (array, callback) ->
    args = Array::slice.apply(arguments)
    callback = args.pop()
    array = args.pop() or this
    i = 0

    while i < array.length
      return false  if callback(array[i])
      i++
    true

  detect: (array, callback) ->
    args = Array::slice.apply(arguments)
    callback = args.pop()
    array = args.pop() or this
    i = 0

    while i < array.length
      return array[i]  if callback(array[i])
      i++

  select: (array, callback) ->
    args = Array::slice.apply(arguments)
    callback = args.pop()
    array = args.pop() or this
    result = []
    i = 0

    while i < array.length
      result.push array[i]  if callback(array[i])
      i++
    result

  slice: (object, key) ->
    keys = Array::slice.apply(arguments)
    object = (if (typeof keys[0] is 'object') then keys.shift() else this)
    result = {}
    for key of object
      result[key] = object[key]  if keys.indexOf(key) > -1
    result

  only: (object) ->
    keys = Array::slice.apply(arguments)
    object = (if (typeof keys[0] is 'object') then keys.shift() else this)
    result = {}
    for key of object
      result[key] = object[key]  unless keys.indexOf(key) is -1
    result

  except: (object) ->
    keys = Array::slice.apply(arguments)
    object = (if (typeof keys[0] is 'object') then keys.shift() else this)
    result = {}
    for key of object
      result[key] = object[key]  if keys.indexOf(key) is -1
    result

  intersect: (array, other) ->
    array.filter (element) ->
      other.indexOf(element) != -1

  map: (elems, callback, arg) ->
    value = undefined
    key = undefined
    ret = []
    i = 0
    length = elems.length
    isArray = elems instanceof jQuery || length != undefined && typeof length == 'number' && (length > 0 && elems[0] && elems[length - 1]) || length == 0 || jQuery.isArray(elems)
    if isArray
      while i < length
        value = callback(elems[i], i, arg)
        ret[ret.length] = value  if value?
        i++
    else
      for key of elems
        value = callback(elems[key], key, arg)
        ret[ret.length] = value  if value?
    ret.concat.apply [], ret

  shuffle: (array) ->
    array = array.slice()
    top = array.length
    while top && --top
      current = Math.floor(Math.random() * (top + 1))
      tmp = array[current]
      array[current] = array[top]
      array[top] = tmp
    array

  truncate: (string, length) ->
    if string.length > length then string.trim().substring(0, length) + '...' else string
