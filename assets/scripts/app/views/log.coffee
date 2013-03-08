require 'log'

Log.DEBUG = true

Travis.reopen
  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'
    contextBinding: 'job'

    willDestroyElement: ->
      job = @get('job')
      job.unsubscribe() if job

    toTop: () ->
      $(window).scrollTop(0)

  PreView: Em.View.extend
    templateName: 'jobs/pre'

    didInsertElement: ->
      console.log 'log view: did insert' if Log.DEBUG
      @_super.apply this, arguments
      @createEngine()
      @lineNumberDidChange()

    willDestroyElement: ->
      console.log 'log view: will destroy' if Log.DEBUG
      parts = @get('log.parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')

    versionDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log.version')

    logDidChange: (->
      console.log 'log view: log did change: rerender' if Log.DEBUG
      @rerender() if @get('inDOM')
    ).observes('log')

    createEngine: ->
      console.log 'log view: create engine' if Log.DEBUG
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
      console.log 'log view: parts did change' if Log.DEBUG
      for part, i in parts.slice(start, start + added)
        @engine.set(part.number, part.content)
        @propertyDidChange('limited')
        break if @get('limited')

    lineNumberDidChange: (->
      @scroll.set(number) if !@get('isDestroyed') && number = @get('controller.lineNumber')
    ).observes('controller.lineNumber')

    limited: (->
      @limit && @limit.limited
    ).property()

    plainTextLogUrl: (->
      Travis.Urls.plainTextLog(id) if id = @get('log.job.id')
    ).property('job.log.id')

    toggleTailing: ->
      Travis.tailing.toggle()
      event.preventDefault()

    numberLineOnHover: ->
      $('#log').on 'mouseenter', 'a', ->
        $(this).attr('href', '#L' + ($(this.parentNode).prevAll('p:visible').length + 1))

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

  insert: (log, line, pos) ->
    @tryScroll() if @number
    true

  tryScroll: ->
    if element = $("#log p:visible")[@number - 1]
      $('#main').scrollTop(0)
      $('html, body').scrollTop($(element).offset()?.top) # weird, html works in chrome, body in firefox
      @highlight(element)
      @number = undefined

  highlight: (element) ->
    $('#log p.highlight').removeClass('highlight')
    $(element).addClass('highlight')

Log.Logger = ->
Log.Logger.prototype = $.extend new Log.Listener,
  receive: (log, num, string) ->
    @log("rcv #{num} #{JSON.stringify(string)}")
    true
  insert: (log, element, pos) ->
    @log("ins #{element.id}, #{if pos.before then 'before' else 'after'}: #{pos.before || pos.after || '?'}, #{JSON.stringify(element)}")
  remove: (log, element) ->
    @log("rem #{element.id}")
  log: (line) ->
    console.log(line)
