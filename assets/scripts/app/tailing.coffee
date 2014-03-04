class Travis.ToTop
  # NOTE: I could have probably extract fixed positioning from
  #       Tailing, but then I would need to parametrize positionElement
  #       function to make it flexible to handle both cases. In that
  #       situation I prefer a bit less DRY code over simplicity of
  #       the calculations.
  constructor: (@window, @element_selector, @container_selector) ->
    @position = @window.scrollTop()
    @window.scroll( $.throttle( 200, @onScroll.bind(this) ) )
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
    containerHeight = container.height()
    windowHeight = @window.height()
    offset = container.offset().top + containerHeight - (@window.scrollTop() + windowHeight)
    max = containerHeight - windowHeight
    offset = max if offset > max
    console.log(offset, max)
    if offset > 0
      element.css(bottom: offset)
    else
      element.css(bottom: 2)

class @Travis.Tailing
  options:
    timeout: 200

  tail: ->
    $(@tail_selector)
  log: ->
    $(@log_selector)

  constructor: (@window, @tail_selector, @log_selector) ->
    @position = @window.scrollTop()
    @window.scroll( $.throttle( 200, @onScroll.bind(this) ) )
    this

  run: ->
    @autoScroll()
    @positionButton()
    Ember.run.later(@run.bind(this), @options.timeout) if @active()

  toggle: ->
    if @active() then @stop() else @start()

  active: ->
    @tail().hasClass('active')

  start: ->
    @tail().addClass('active')
    @run()

  stop: ->
    @tail().removeClass('active')

  autoScroll: ->
    return false unless @active()
    logBottom = @log().offset().top + @log().outerHeight() + 40
    winBottom = @window.scrollTop() + @window.height()

    if logBottom - winBottom > 0
      @window.scrollTop(logBottom - @window.height())
      true
    else
      false

  onScroll: ->
    @positionButton()
    position = @window.scrollTop()
    @stop() if position < @position
    @position = position

  positionButton: ->
    return if @tail().length is 0
    offset = @window.scrollTop() - @log().offset().top
    max = @log().height() - @tail().height() + 5

    if offset > 0 && offset <= max
      @tail().removeClass('bottom')
      @tail().addClass('scrolling')
    else
      if offset > max
        @tail().addClass('bottom')
      else
        @tail().removeClass('bottom')
      @tail().removeClass('scrolling')
