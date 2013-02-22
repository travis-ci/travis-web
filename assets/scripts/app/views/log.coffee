require 'log'

Travis.reopen
  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'
    contextBinding: 'job'

    init: ->
      @_super.apply this, arguments

    plainTextLogUrl: (->
      if id = @get('job.log.id')
        Travis.Urls.plainTextLog(id)
    ).property('log')

    didInsertElement: ->
      job = @get('job')
      job.subscribe() if job && !job.get('isFinished')

      @_super.apply this, arguments
      #@tryScrollingToHashLineNumber()

    scrollTo: (hash) ->
      # and this is even more weird, when changing hash in URL in firefox
      # to other value, for example #L10, it actually scrolls just #main
      # element... this is probably some CSS issue, I don't have time to
      # investigate at the moment
      # TODO: fix this
      $('#main').scrollTop 0

      # weird, html works in chrome, body in firefox
      $('html,body').scrollTop $(hash).offset().top

      @set 'controller.lineNumberHash', null

    lineNumberHashDidChange: (->
      @tryScrollingToHashLineNumber()
    ).observes('controller.lineNumberHash')

    tryScrollingToHashLineNumber: ->
      if hash = @get 'controller.lineNumberHash'
        self = this

        checker = ->
          return if self.get('isDestroyed')

          if $(hash).length
            self.scrollTo(hash)
          else
            setTimeout checker, 100

        checker()

    click: ->
      target = $(event.target)

      target.closest('.fold').toggleClass('open')

      if target.is('a') && target.attr('id') && target.attr('id').match(/^L\d+$/)
        path = target.attr 'href'
        Travis.get('router').route(path)
        event.stopPropagation()
        return false

    toTop: () ->
      $(window).scrollTop(0)

    logUrl: (->
      repo = @get('job.repo')
      item = @get('parentView.currentItem')

      if repo && item
        event = if item.constructor == Travis.Build
          'showBuild'
        else
          'showJob'

        #Travis.get('router').urlForEvent(event, repo, item)
    ).property('job.repo', 'parentView.currentItem')

  PreView: Em.View.extend
    templateName: 'jobs/pre'

    createEngine: ->
      limit = new Log.Limit
      scroll = new Log.Scroll
      engine = Log.create(listeners: [limit, new Log.FragmentRenderer, new Log.Folds, scroll])

      @set('scroll', scroll)
      @set('limit', limit)
      @set('engine', engine)

      @observeParts()

    observeParts: ->
      parts = @get('log.parts')
      parts.addArrayObserver(@, didChange: 'partsDidChange', willChange: 'partsWillChange')
      @partsDidChange(parts.slice(0))

    didInsertElement: ->
      @_super.apply this, arguments
      @createEngine()

    willDestroyElement: ->
      parts = @get('log.parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'partsWillChange')

    partsWillChange: ->

    partsDidChange: (parts, start, _, added) ->
      unless @get('isLimited')
        start ||= 0
        added ||= parts.length
        @get('engine').set(part.number, part.content) for part, i in parts.slice(start, start + added)
        #@propertyDidChange('isLimited')

    versionDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log.version')

    logDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log')

    isLimited: (->
      @limit && @limit.isLimited()
    ).property()

    plainTextLogUrl: (->
      Travis.Urls.plainTextLog(id) if id = @get('log.job.id')
    ).property('job.log.id')

    toggleTailing: (event) ->
      Travis.app.tailing.toggle()
      event.preventDefault()

    lineNumbers: ->
      $('#log').on 'mouseenter', 'a', ->
        $(this).attr('href', '#L' + ($(this.parentNode).prevAll('p').length + 1))

    folds: ->
      $('#log').on 'click', '.fold', ->
        $(this).toggleClass('open')

    click: (event) ->
      target = $(event.target)
      target.closest('.fold').toggleClass('open')
      if target.is('a') && matches = target.attr('href')?.match(/#L(\d+)$/)
        Travis.app.get('router.location').setURL(target.attr('href'))
        @set('controller.lineNumber', matches[1])
        event.stopPropagation()
        return false

    lineNumberObserver: (->
      @scroll.set(number) if !@get('isDestroyed') && number = @get('controller.lineNumber')
    ).observes('controller.lineNumber')

Log.Scroll = ->
Log.Scroll.prototype = $.extend new Log.Listener,
  set: (number) ->
    return unless number
    @number = number
    @tryScroll()

  insert: (log, after, data) ->
    @tryScroll() if @number

  tryScroll: ->
    if element = $("#log p:nth-child(#{@number})")
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
