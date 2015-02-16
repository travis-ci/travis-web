`import Ember from 'ember'`

class ToTop
  # NOTE: I could have probably extract fixed positioning from
  #       Tailing, but then I would need to parametrize positionElement
  #       function to make it flexible to handle both cases. In that
  #       situation I prefer a bit less DRY code over simplicity of
  #       the calculations.
  constructor: (@window, @element_selector, @container_selector) ->
    @position = @window.scrollTop()
    @window.scroll =>
      Ember.run.throttle(this, @onScroll, [], 200, false)
    this

  element: ->
    $(@element_selector)
  container: ->
    $(@container_selector)

  onScroll: ->
    @positionElement()

  positionElement: ->
    element = @element()
    container = @container()
    return if element.length is 0
    containerHeight = container.outerHeight()
    windowHeight = @window.height()
    offset = container.offset().top + containerHeight - (@window.scrollTop() + windowHeight)
    max = containerHeight - windowHeight
    offset = max if offset > max
    if offset > 0
      element.css(bottom: offset + 4)
    else
      element.css(bottom: 2)

`export default ToTop`
