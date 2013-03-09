minispade.require 'app'

@reset = ->
  Em.run ->
    if Travis.app
      if Travis.app.store
        Travis.app.store.destroy()
      Travis.app.destroy()
      delete Travis.app
      delete Travis.store

  waits(500) # TODO not sure what we need to wait for here
  $('#application').remove()
  $('body').append( $('<div id="application"></div>') )

@app = (url) ->
  reset()
  Em.run ->
    Travis.run(rootElement: $('#application'))
    waitFor -> Travis.app
    # TODO: so much waiting here, I'm sure we can minimize this
    runs ->
      url = "/#{url}" if url && !url.match(/^\//)
      Travis.app.router.route(url)
      waits 500
      runs ->
        foo = 'bar'

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
