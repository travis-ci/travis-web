require 'log'
require 'travis/lines_selector'
require 'travis/log_folder'

Log.DEBUG = true
Log.LIMIT = 10000

Travis.reopen
  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'

    didInsertElement: ->
      @setupLog()

    logDidChange: (->
      @setupLog()
    ).observes('log')

    logWillChange: (->
      @teardownLog()
    ).observesBefore('log')

    willDestroyElement: ->
      @teardownLog()

    teardownLog: ->
      job = @get('job')
      job.unsubscribe() if job

    setupLog: ->
      job = @get('job')
      if job
        job.get('log').fetch()
        job.subscribe()

  PreView: Em.View.extend
    templateName: 'jobs/pre'

    logWillChange: (->
      console.log 'log view: log will change' if Log.DEBUG
      @teardownLog()
    ).observesBefore('log')

    didInsertElement: ->
      console.log 'log view: did insert' if Log.DEBUG
      @_super.apply this, arguments
      @createEngine()

    willDestroyElement: ->
      console.log 'log view: will destroy' if Log.DEBUG
      @teardownLog()

    versionDidChange: (->
      @rerender() if @get('_state') == 'inDOM'
    ).observes('log.version')

    logDidChange: (->
      console.log 'log view: log did change: rerender' if Log.DEBUG

      if @get('log')
        @createEngine()
        @rerender() if @get('_state') == 'inDOM'
    ).observes('log')

    teardownLog: ->
      if @get('log')
        parts = @get('log.parts')
        parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
        parts.destroy()
        @lineSelector?.willDestroy()

    createEngine: ->
      if @get('log')
        console.log 'log view: create engine' if Log.DEBUG
        @scroll = new Log.Scroll beforeScroll: =>
          @unfoldHighlight()
        @engine = Log.create(limit: Log.LIMIT, listeners: [@scroll])
        @logFolder = new Travis.LogFolder(@$().find('#log'))
        @lineSelector = new Travis.LinesSelector(@$().find('#log'), @scroll, @logFolder)
        @observeParts()

    unfoldHighlight: ->
      @lineSelector.unfoldLines()

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

    limited: (->
      @engine?.limit?.limited
    ).property()

    plainTextLogUrl: (->
      Travis.Urls.plainTextLog(id) if id = @get('log.job.id')
    ).property('job.log.id')

    toggleTailing: ->
      Travis.tailing.toggle()
      @engine.autoCloseFold = !Travis.tailing.isActive()
      event.preventDefault()

    actions:
      toTop: () ->
        $(window).scrollTop(0)

    noop: -> # TODO required?

Log.Scroll = (options) ->
  options ||= {}
  @beforeScroll = options.beforeScroll
  this
Log.Scroll.prototype = $.extend new Log.Listener,
  insert: (log, data, pos) ->
    @tryScroll() if @numbers
    true

  tryScroll: ->
    if element = $("#log p:visible.highlight:first")
      if @beforeScroll
        @beforeScroll()
      $('#main').scrollTop(0)
      $('html, body').scrollTop(element.offset()?.top - (window.innerHeight / 3)) # weird, html works in chrome, body in firefox

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
