@Travis.Slider = (storage) ->
  @minimize() if storage.getItem('travis.maximized') == 'true'
  this

$.extend Travis.Slider.prototype,
  persist: ->
    Travis.storage.setItem('travis.maximized', @isMinimized())

  isMinimized: ->
    return $('body').hasClass('maximized');

  minimize: ->
    $('body').addClass('maximized')

  toggle: ->
    $('body').toggleClass('maximized')
    @persist()
    # TODO gotta force redraws here :/
    element = $('<span></span>')
    $('#top .profile').append(element)
    Em.run.later (-> element.remove()), 10



