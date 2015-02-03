`import Ember from 'ember'`

Slider = (storage) ->
  @minimize() if storage.getItem('travis.maximized') == 'true'
  this

Slider.prototype.persist = ->
  Travis.storage.setItem('travis.maximized', @isMinimized())

Slider.prototype.isMinimized = ->
  return $('body').hasClass('maximized');

Slider.prototype.minimize = ->
  $('body').addClass('maximized')

Slider.prototype.toggle = ->
  $('body').toggleClass('maximized')
  @persist()
  # TODO gotta force redraws here :/
  element = $('<span></span>')
  $('#top .profile').append(element)
  Ember.run.later (-> element.remove()), 10

`export default Slider`
