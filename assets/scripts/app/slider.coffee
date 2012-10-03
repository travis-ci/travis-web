@Travis.Slider = ->
  @minimize() if localStorage?.getItem('travis.maximized') == 'true'
  this

$.extend Travis.Slider.prototype,
  persist: ->
    localStorage?.setItem('travis.maximized', @isMinimized())

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



