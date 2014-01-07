require 'log'

Log.DEBUG = false
Log.LIMIT = 10000

Travis.reopen
  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'
    contextBinding: 'job'

    didInsertElement: ->
      job = @get('job')
      if job
        job.get('log').fetch()
        job.subscribe()

    willDestroyElement: ->
      job = @get('job')
      job.unsubscribe() if job

  PreView: Em.View.extend
    templateName: 'jobs/pre'

    didInsertElement: ->
      console.log 'log view: did insert' if Log.DEBUG
      @_super.apply this, arguments
      @createEngine()
      @lineNumbersDidChange()

    willDestroyElement: ->
      console.log 'log view: will destroy' if Log.DEBUG
      parts = @get('log.parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')

    versionDidChange: (->
      @rerender() if @get('state') == 'inDOM'
    ).observes('log.version')

    logDidChange: (->
      console.log 'log view: log did change: rerender' if Log.DEBUG
      @rerender() if @get('state') == 'inDOM'
    ).observes('log')

    createEngine: ->
      console.log 'log view: create engine' if Log.DEBUG
      @scroll = new Log.Scroll
      @engine = Log.create(limit: Log.LIMIT, listeners: [@scroll])
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
        # console.log "limit in log view: #{@get('limited')}"
        break if @get('limited')
        @engine.set(part.number, part.content)
        @propertyDidChange('limited')

    lineNumbersDidChange: (->
      @scroll.set(numbers) if !@get('isDestroyed') && numbers = @get('controller.lineNumbers')
    ).observes('controller.lineNumbers')

    limited: (->
      @engine?.limit?.limited
    ).property()

    plainTextLogUrl: (->
      Travis.Urls.plainTextLog(id) if id = @get('log.job.id')
    ).property('job.log.id')

    toggleTailing: ->
      Travis.tailing.toggle()
      event.preventDefault()

    numberLineOnHover: ->
      $('#log').on 'mouseenter', 'a', (event) ->
        hovered  = $("#log p:visible").index(@parentNode) + 1
        selected = $("#log p:visible").index($('#log p.highlight')) + 1

        if event.shiftKey
          end   = "-L#{hovered}"
          start = selected
        else
          start = hovered
          end   = ''

        $(@).attr('href', "#L#{start}#{end}")

    click: (event) ->
      if (href = $(event.target).attr('href')) && matches = href?.match(Travis.LineNumberRegex)
        lines = [matches[1], matches[3]].sort (a, b) -> a - b

        @lineNumberClicked(lines[0], lines[1])
        event.stopPropagation()
        false
      else
        target = $(event.target)
        target.closest('.fold').toggleClass('open')

    lineNumberClicked: (start, end) ->
      second_number = if end then "-L#{end}" else ''
      path = "#{window.location.pathname}#L#{start}#{second_number}"
      window.history.pushState({ path: path }, null, path);
      @get('controller.controllers.repo').setLineNumbers(start, end)

    actions:
      toTop: () ->
        $(window).scrollTop(0)

    noop: -> # TODO required?

Log.Scroll = ->
Log.Scroll.prototype = $.extend new Log.Listener,
  set: (numbers) ->
    return unless numbers.length > 0
    @numbers = numbers
    @tryScroll()

  insert: (log, data, pos) ->
    @tryScroll() if @numbers
    true

  tryScroll: ->
    @removeHighlights()
    @scrollToFirstLine()

    first_line = @numbers[0] - 1
    last_line  = @numbers[@numbers.length - 1]

    $('#log').find('p:visible').slice(first_line, last_line).addClass('highlight')
    @numbers = undefined

  removeHighlights: ->
    $('#log p.highlight').removeClass('highlight')

  scrollToFirstLine: ->
    if element = $("#log p:visible")[@numbers[0] - 1]
      $('#main').scrollTop(0)
      $('html, body').scrollTop($(element).offset()?.top) # weird, html works in chrome, body in firefox

# Log.Logger = ->
# Log.Logger.prototype = $.extend new Log.Listener,
#   receive: (log, num, string) ->
#     @log("rcv #{num} #{JSON.stringify(string)}")
#     true
#   insert: (log, element, pos) ->
#     @log("ins #{element.id}, #{if pos.before then 'before' else 'after'}: #{pos.before || pos.after || '?'}, #{JSON.stringify(element)}")
#   remove: (log, element) ->
#     @log("rem #{element.id}")
#   log: (line) ->
#     console.log(line)
