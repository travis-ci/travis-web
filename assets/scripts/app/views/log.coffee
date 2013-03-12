require 'log'
require 'travis/ordered_log'

Log.DEBUG = true

Travis.UnorderedLogEngineMixin = Ember.Mixin.create
  setupEngine: ->
    console.log 'log view: create engine' if Log.DEBUG
    @limit = new Log.Limit
    @scroll = new Log.Scroll
    @engine = Log.create(listeners: [new Log.FragmentRenderer, new Log.Folds, @scroll])
    @observeParts()
    @numberLineOnHover()

  destroyEngine: ->
    parts = @get('log.parts')
    parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')

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

  lineNumberDidChange: (->
    @scroll.set(number) if !@get('isDestroyed') && number = @get('controller.lineNumber')
  ).observes('controller.lineNumber')

Travis.OrderedLogEngineMixin = Ember.Mixin.create
  setupEngine: ->
    @set('logManager', Travis.OrderedLog.create(target: this))

    @get('logManager').append @get('log.parts').map( (part) -> Ember.get(part, 'content') )

    @get('log.parts').addArrayObserver this,
      didChange: 'partsDidChange'
      willChange: 'partsWillChange'

  destroyEngine: (view) ->
    @get('logManager').destroy()
    @get('log.parts').removeArrayObserver this,
      didChange: 'partsDidChange'
      willChange: 'noop'

  partsDidChange: (parts, index, removedCount, addedCount) ->
    addedParts = parts.slice(index, index + addedCount).map( (part) -> Ember.get(part, 'content') )
    @get('logManager').append addedParts

  lineNumberDidChange: (->
    if number = @get('controller.lineNumber')
      @tryScrollingToHashLineNumber(number)
  ).observes('controller.lineNumber')

  scrollTo: (id) ->
    # and this is even more weird, when changing hash in URL in firefox
    # to other value, for example #L10, it actually scrolls just #main
    # element... this is probably some CSS issue, I don't have time to
    # investigate at the moment
    # TODO: fix this
    $('#main').scrollTop 0

    # weird, html works in chrome, body in firefox
    $('html,body').scrollTop $(id).offset().top

    @set 'controller.lineNumber', null

  tryScrollingToHashLineNumber: (number) ->
    id = "#L#{number}"
    checker = =>
      return if @get('isDestroyed')

      if $(id).length
        @scrollTo(id)
      else
        setTimeout checker, 100

    checker()

  appendLog: (payloads) ->
    url = @get('logUrl')

    leftOut  = []
    cut      = false
    fragment = document.createDocumentFragment()

    # TODO: refactor this loop, it's getting messy
    for payload in payloads
      line   = payload.content
      number = payload.number

      if payload.logWasCut
        cut = true
      else
        unless payload.append
          pathWithNumber = "#{url}#L#{number}"
          p = document.createElement('p')
          p.innerHTML = "<a href=\"#{pathWithNumber}\" id=\"L#{number}\"></a>#{line}"
          line = p

        if payload.fold && !payload.foldContinuation
          div = document.createElement('div')
          div.appendChild line
          div.className = "fold #{payload.fold} show-first-line"
          line = div

        if payload.replace
          if link = fragment.querySelector("#L#{number}")
            link.parentElement.innerHTML = line.innerHTML
          else
            this.$("#L#{number}").parent().replaceWith line
        else if payload.append
          if link = fragment.querySelector("#L#{number}")
            link.parentElement.innerHTML += line
          else
            this.$("#L#{number}").parent().append line
        else if payload.foldContinuation
          folds = fragment.querySelectorAll(".fold.#{payload.fold}")
          if fold = folds[folds.length - 1]
            fold.appendChild line
          else
            this.$("#log .fold.#{payload.fold}:last").append line
        else
          fragment.appendChild(line)

        if payload.openFold
          folds = fragment.querySelectorAll(".fold.#{payload.openFold}")
          if fold = folds[folds.length - 1]
            fold = $(fold)
          else
            fold = this.$(".fold.#{payload.openFold}:last")

          fold.removeClass('show-first-line').addClass('open')

        if payload.foldEnd
          folds = fragment.querySelectorAll(".fold.#{payload.fold}")
          if fold = folds[folds.length - 1]
            fold = $(fold)
          else
            fold = this.$(".fold.#{payload.fold}:last")

          fold.removeClass('show-first-line')

    this.$('#log')[0].appendChild fragment
    if cut
      url = Travis.Urls.plainTextLog(@get('log.id'))
      this.$("#log").append $("<p class=\"cut\">Log was too long to display. Download the <a href=\"#{url}\">the raw version</a> to get the full log.</p>")


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

  PreView: Em.View.extend(Travis.OrderedLogEngineMixin, {
    templateName: 'jobs/pre'

    didInsertElement: ->
      console.log 'log view: did insert' if Log.DEBUG
      @_super.apply this, arguments
      @setupEngine()
      @lineNumberDidChange()

    willDestroyElement: ->
      console.log 'log view: will destroy' if Log.DEBUG
      @destroyEngine()

    versionDidChange: (->
      @rerender() if @get('inDOM')
    ).observes('log.version')

    logDidChange: (->
      console.log 'log view: log did change: rerender' if Log.DEBUG
      @rerender() if @get('inDOM')
    ).observes('log')

    #limited: (->
    #  @limit && @limit.limited
    #).property()

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

    logUrl: (->
      repo = @get('log.job.repo')
      item = @get('controller.currentItem')

      if repo && item
        name = if item.constructor == Travis.Build
          'build'
        else
          'job'

        Travis.__container__.lookup('router:main').generate(name, repo, item)
    ).property('job.repo', 'parentView.currentItem')

    lineNumberClicked: (number) ->
      path = @get('logUrl') + "#L#{number}"
      window.history.replaceState({ path: path }, null, path);
      @set('controller.lineNumber', number)

    noop: -> # TODO required?
  })

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
