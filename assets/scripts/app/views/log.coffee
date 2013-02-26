require 'log'

Travis.reopen
  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'
    contextBinding: 'job'

    didInsertElement: ->
      job = @get('job')
      job.subscribe() if job && !job.get('isFinished')

    toTop: () ->
      $(window).scrollTop(0)

  PreView: Em.View.extend
    templateName: 'jobs/pre'

    didInsertElement: ->
      @_super.apply this, arguments
      @createEngine()
      @lineNumberDidChange()

    willDestroyElement: ->
      parts = @get('log.parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')

    versionDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log.version')

    logDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log')

    createEngine: ->
      @limit = new Log.Limit
      @scroll = new Log.Scroll
      @engine = Log.create(listeners: [@limit, new Log.FragmentRenderer, new Log.Folds, @scroll])
      @observeParts()
      @numberLineOnHover()

    observeParts: ->
      parts = @get('log.parts')
      parts.addArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
      parts = parts.slice(0)
      @partsDidChange(parts, 0, null, parts.length)

    partsDidChange: (parts, start, _, added) ->
      unless @get('isLimited')
        @engine.set(part.number, part.content) for part, i in parts.slice(start, start + added)
        @propertyDidChange('isLimited')

    lineNumberDidChange: (->
      @scroll.set(number) if !@get('isDestroyed') && number = @get('controller.lineNumber')
    ).observes('controller.lineNumber')

    isLimited: (->
      @limit && @limit.isLimited()
    ).property()

    plainTextLogUrl: (->
      Travis.Urls.plainTextLog(id) if id = @get('log.job.id')
    ).property('job.log.id')

    toggleTailing: ->
      Travis.tailing.toggle()
      event.preventDefault()

    numberLineOnHover: ->
      $('#log').on 'mouseenter', 'a', ->
        $(this).attr('href', '#L' + ($(this.parentNode).prevAll('p').length + 1))

    click: ->
      if (href = $(event.target).attr('href')) && matches = href?.match(/#L(\d+)$/)
        @lineNumberClicked(matches[1])
        event.stopPropagation()
        false
      else
        target = $(event.target)
        target.closest('.fold').toggleClass('open')

    lineNumberClicked: (number) ->
      window.history.pushState(null, null, "#{window.location.pathname}#L#{number}");
      @set('controller.lineNumber', number)

    noop: -> # TODO required?

Log.Scroll = ->
Log.Scroll.prototype = $.extend new Log.Listener,
  set: (number) ->
    return unless number
    @number = number
    @tryScroll()

  insert: (log, after, data) ->
    @tryScroll() if @number

  tryScroll: ->
    if (element = $("#log p:nth-child(#{@number})")) && element.length
      $('#main').scrollTop(0)
      $('html, body').scrollTop(element.offset()?.top) # weird, html works in chrome, body in firefox
      @highlight(element)
      @number = undefined

  highlight: (element) ->
    $('#log p.highlight').removeClass('highlight')
    $(element).addClass('highlight')

Log.Limit = ->
Log.Limit.prototype = $.extend new Log.Listener,
  MAX_LINES: 5000
  count: 0

  insert: (log, after, lines) ->
    @count += lines.length
    lines.length = @MAX_LINES if lines.length > @MAX_LINES

  isLimited: ->
    @count > @MAX_LINES
