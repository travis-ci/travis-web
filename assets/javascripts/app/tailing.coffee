@Travis.Tailing = ->
  $(window).scroll(@positionButton.bind(this))
  this

$.extend Travis.Tailing.prototype,
  options:
    timeout: 200

  run: ->
    @autoScroll()
    Ember.run.later(@run.bind(this), @options.timeout) if @active()

  toggle: (event) ->
    if @active() then @stop() else @start()

  active: ->
    $('#tail').hasClass('active')

  start: ->
    $('#tail').addClass('active')
    @run()

  stop: ->
    $('#tail').removeClass('active')

  autoScroll: ->
    return unless @active()
    win = $(window)
    log = $('#log')
    logBottom = log.offset().top + log.outerHeight() + 40
    winBottom = win.scrollTop() + win.height()
    win.scrollTop(logBottom - win.height()) if logBottom - winBottom > 0

  positionButton: ->
    tail = $('#tail')
    return if tail.length is 0
    offset = $(window).scrollTop() - $('#log').offset().top
    max = $('#log').height() - $('#tail').height() + 5
    offset = max if offset > max
    if offset > 0
      tail.css(top: offset - 2)
    else
      tail.css(top: 0)

