@Travis.reopen
  JobsView: Travis.View.extend
    templateName: 'jobs/list'
    buildBinding: 'controller.build'

  JobsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForState(@get('job.state'))
    ).property('job.state')

  JobView: Travis.View.extend
    templateName: 'jobs/show'

    repoBinding: 'controller.repo'
    jobBinding: 'controller.job'
    commitBinding: 'job.commit'

    currentItemBinding: 'job'

    color: (->
      Travis.Helpers.colorForState(@get('job.state'))
    ).property('job.state')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
    ).property('repo.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@get('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@get('commit.committerEmail'))
    ).property('commit.committerEmail')

  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'

    plainTextLogUrl: (->
      if id = @get('job.log.id')
        Travis.Urls.plainTextLog(id)
    ).property('job.log')

    didInsertElement: ->
      @_super.apply this, arguments
      @tryScrollingToHashLineNumber()

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

    click: (event) ->
      target = $(event.target)

      target.closest('.fold').toggleClass('open')

      if target.is('a') && target.attr('id') && target.attr('id').match(/^L\d+$/)
        path = target.attr 'href'
        Travis.app.get('router').route(path)
        event.stopPropagation()
        return false

    toTop: () ->
      $(window).scrollTop(0)

    jobBinding: 'context'

    logSubscriber: (->
      # for some reason observing context does not work,
      # TODO: find out why
      job = @get('job')
      job.subscribe() if job && !job.get('isFinished')
      null
    ).property('job', 'job.isFinished')

    logUrl: (->
      repo = @get('job.repo')
      item = @get('parentView.currentItem')

      if repo && item
        event = if item.constructor == Travis.Build
          'showBuild'
        else
          'showJob'

        Travis.app.get('router').urlForEvent(event, repo, item)
    ).property('job.repo', 'parentView.currentItem')

  PreView: Em.View.extend
    templateName: 'jobs/pre'
    init: ->
      @_super.apply this, arguments
      @set 'logManager', Travis.Log.create(target: this)

    toggleTailing: (event) ->
      Travis.app.tailing.toggle()
      event.preventDefault()

    didInsertElement: ->
      @_super.apply this, arguments

      Ember.run.next this, ->
        if @get 'log'
          @logDidChange()

    willDestroy: ->
      @get('logManager').destroy()
      @get('log.parts').removeArrayObserver this,
        didChange: 'logContentsDidChange'
        willChange: 'logContentsWillChange'

    version: (->
      @rerender()
      @set 'logManager', Travis.Log.create(target: this)
    ).observes('log.version')

    logDidChange: (->
      if @get('log') && @state == 'inDOM'
        @attachLogObservers()
    ).observes('log')

    attachLogObservers: ->
      return if @get('logPartsObserversAttached') == Ember.guidFor(@get('log'))
      @set 'logPartsObserversAttached', Ember.guidFor(@get('log'))

      Ember.run.next this, ->
        @get('logManager').append @get('log.parts')

        @get('log.parts').addArrayObserver this,
          didChange: 'logContentsDidChange'
          willChange: 'logContentsWillChange'

    logContentsDidChange: (lines, index, removedCount, addedCount) ->
      addedLines = lines.slice(index, index + addedCount)
      @get('logManager').append addedLines

    logContentsWillChange: (-> )

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
            p.innerHTML = "<a href=\"#{pathWithNumber}\" id=\"L#{number}\">#{number}</a>#{line}"
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

