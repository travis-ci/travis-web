minispade.require 'app'

@app = (url) ->
  # TODO: this should wait till app is initialized, not some
  #       arbitrary amount of time
  waits(50)
  runs ->
    Travis.reset()
    Travis.__container__.lookup('router:main').handleURL(url)

_Date = Date
@Date = (date) ->
  new _Date(date || '2012-07-02T00:03:00Z')
@Date.UTC = _Date.UTC

# hacks for missing features in webkit
unless Function::bind
  Function::bind = (oThis) ->

    # closest thing possible to the ECMAScript 5 internal IsCallable function
    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")  if typeof this isnt "function"
    aArgs = Array::slice.call(arguments, 1)
    fToBind = this
    fNOP = ->

    fBound = ->
      fToBind.apply (if this instanceof fNOP and oThis then this else oThis), aArgs.concat(Array::slice.call(arguments_))

    fNOP.prototype = @.prototype
    fBound.prototype = new fNOP()
    fBound

window.history.state = {}
oldPushState = window.history.pushState
window.history.pushState = (state, title, href) ->
  window.history.state = state
  oldPushState.apply this, arguments
